const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  barberId: { type: mongoose.Schema.Types.ObjectId, ref: "Barber", required: true },
  service: {
    name: String,
    duration: Number,
    price: Number, // store in minor units (kobo/cents)
    currency: String
  },
  slot: {
    startUtc: Date,
    endUtc: Date,
    booked: { type: Boolean, default: false }
  },
  status: {
    type: String,
    enum: ["PENDING_PAYMENT", "CONFIRMED", "CANCELED", "REFUNDED"],
    default: "PENDING_PAYMENT"
  },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
