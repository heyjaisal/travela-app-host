const Host = require("../model/profile");
const Booking = require('../model/Ticket')
const cloudinary = require("../config/cloudinary")

require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.connectStripeAccount = async (req, res) => {
  try {
    const hostId = req.userId;
    const host = await Host.findById(hostId);
    if (!host) return res.status(404).json({ error: "Host not found" });

    let stripeAccountId = host.stripeAccountId;
    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: "express",
        country: "US",
        email: host.email,
        capabilities: { transfers: { requested: true } },
      });
      host.stripeAccountId = account.id;
      host.profileSetup = true;
      await host.save();
      stripeAccountId = account.id;
    }

    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${process.env.CLIENT_URL}/host/stripe-retry`,
      return_url: `${process.env.CLIENT_URL}/home`,
      type: "account_onboarding",
    });

    res.json({ url: accountLink.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.ReleaseEventPayment = async (req, res) => {
  const hostId = req.userId;
  const { bookingId } = req.body;

  if (!bookingId) {
    return res.status(400).json({ error: "Booking ID is required." });
  }

  try {
    const booking = await Booking.findById(bookingId).populate('hostId');

    if (!booking) return res.status(404).json({ error: "Booking not found." });

    if (booking.hostId._id.toString() !== hostId.toString()) {
      return res.status(403).json({ error: "Unauthorized host." });
    }

    if (booking.isCheckedIn) {
      return res.status(400).json({ error: "Already checked in." });
    }

   
    const platformFee = booking.platformFee || 4; 
    const hostShare = Math.round((booking.totalAmount * (1 - platformFee / 100)) * 100); 

    await stripe.transfers.create({
      amount: hostShare,
      currency: 'usd',
      destination: booking.hostId.stripeAccountId,
      transfer_group: booking._id.toString(),
    });

    booking.isCheckedIn = true;
    booking.paymentStatus = "released";
    booking.hostPayoutStatus = "completed";
    await booking.save();

    res.status(200).json({ success: true, message: "Payment sent to host." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
