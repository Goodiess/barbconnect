// src/models/Payment.js
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true },
  provider: { type: String, enum: ["paystack", "stripe"], required: true },
  providerRef: String, // reference ID from payment provider
  amount: Number,      // stored in minor units
  currency: String,
  status: {
    type: String,
    enum: ["INITIATED", "SUCCEEDED", "FAILED", "REFUNDED"],
    default: "INITIATED"
  }
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
