const bookingSchema = new mongoose.Schema(
    {
      property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: true,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      checkInDate: { type: Date, required: true },
      checkOutDate: { type: Date, required: true },
      totalPrice: { type: Number, required: true },
      status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled", "completed"],
        default: "pending",
      },
      numberOfGuests: { type: Number, required: true, min: 1 },
      paymentStatus: {
        type: String,
        enum: ["pending", "paid", "refunded"],
        default: "pending",
      },
    },
    { timestamps: true }
  );
  
  const Booking = mongoose.model("Booking", bookingSchema);