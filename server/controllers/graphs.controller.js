const mongoose = require("mongoose");
const PropertyBooking = require("../model/booking");
const EventBooking = require("../model/Ticket");
const User = require('../model/user')

exports.getBookingStats = async (req, res) => {
  console.log('the time is now');
  
  try {
    const hostId = req.userId;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);
    startDate.setHours(0, 0, 0, 0);

    const [propertyStats, eventStats] = await Promise.all([
      PropertyBooking.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
            hostId: new mongoose.Types.ObjectId(hostId),
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            Property: { $sum: "$Nights" },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      EventBooking.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
            hostId: new mongoose.Types.ObjectId(hostId),
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            Event: { $sum: "$ticketsBooked" },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const mergedMap = new Map();

    propertyStats.forEach((item) => {
      mergedMap.set(item._id, { date: item._id, Property: item.Property, Event: 0 });
    });

    eventStats.forEach((item) => {
      if (mergedMap.has(item._id)) {
        mergedMap.get(item._id).Event = item.Event;
      } else {
        mergedMap.set(item._id, { date: item._id, Property: 0, Event: item.Event });
      }
    });

    const mergedArray = Array.from(mergedMap.values()).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    res.json(mergedArray);
  } catch (err) {
    console.error("Error generating booking stats:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.monthlyPayment = async (req, res) => {
  try {
    const hostId = req.userId; 
    const now = new Date();

    const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const propertyData = await PropertyBooking.aggregate([
      {
        $match: {
          bookedAt: { $gte: start },
          hostId: new mongoose.Types.ObjectId(hostId),
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$bookedAt" },
            month: { $month: "$bookedAt" },
          },
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    const ticketData = await EventBooking.aggregate([
      {
        $match: {
          bookedAt: { $gte: start },
          hostId: new mongoose.Types.ObjectId(hostId),
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$bookedAt" },
            month: { $month: "$bookedAt" },
          },
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    const monthlyMap = new Map();
    for (let i = 0; i < 12; i++) {
      const date = new Date(start.getFullYear(), start.getMonth() + i, 1);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      monthlyMap.set(key, {
        month: date.toLocaleString('default', { month: 'long' }),
        property: 0,
        event: 0,
      });
    }

    for (const item of propertyData) {
      const key = `${item._id.year}-${item._id.month}`;
      if (monthlyMap.has(key)) {
        monthlyMap.get(key).property = item.total;
      }
    }

    for (const item of ticketData) {
      const key = `${item._id.year}-${item._id.month}`;
      if (monthlyMap.has(key)) {
        monthlyMap.get(key).event = item.total;
      }
    }

    const result = Array.from(monthlyMap.values());
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in monthlyPayment:", err);
    res.status(500).json({ message: 'Failed to fetch data' });
  }
};

exports.LatestBookings = async (req, res) => {
  try {
    const userId = req.userId;

    const [tickets, properties] = await Promise.all([
      EventBooking.find({ hostId: userId }).sort({ createdAt: -1 }).limit(3).populate('user', 'email'),
      PropertyBooking.find({ hostId: userId }).sort({ createdAt: -1 }).limit(3).populate('user', 'email')
    ]);

    const bookings = [
      ...tickets.map(b => ({
        email: b.user.email,
        type: 'event',
        totalAmount: b.totalAmount,
        bookingStatus: b.bookingStatus,
        paymentStatus: b.paymentStatus,
        createdAt: b.createdAt
      })),
      ...properties.map(b => ({
        email: b.user.email,
        type: 'property',
        totalAmount: b.totalAmount,
        bookingStatus: b.bookingStatus,
        paymentStatus: b.paymentStatus,
        createdAt: b.createdAt
      }))
    ].sort((a, b) => b.createdAt - a.createdAt).slice(0, 3);

    res.json(bookings);
  } catch (err) {
    console.log(err);
    
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};






