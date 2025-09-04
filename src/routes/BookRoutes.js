const express = require("express");
const axios = require("axios");
const Appointment = require("../models/Appointment");
const Payment = require("../models/Payment");

const router = express.Router();

// Book appointment + init Paystack payment
router.post("/", async (req, res) => {
  try {
    const { customerId, barberId, service, slot, email } = req.body;

    // 1. Create appointment + payment in DB
    const appointment = await Appointment.create({
      customerId,
      barberId,
      service,
      slot,
    });

    const payment = await Payment.create({
      appointmentId: appointment._id,
      provider: "paystack",
      amount: service.price,
      currency: service.currency,
    });

    // 2. Init Paystack transaction
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: service.price, // Paystack expects kobo
        currency: service.currency,
        reference: payment._id.toString(),
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );

    // 3. Save Paystack reference
    await Payment.findByIdAndUpdate(payment._id, {
      providerRef: response.data.data.reference,
    });

    res.json({ checkoutUrl: response.data.data.authorization_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Booking failed" });
  }
});

const crypto = require("crypto");

// Secure Paystack webhook
router.post(
  "/webhook",
  express.json({ type: "application/json" }),
  async (req, res) => {
    try {
      const secret = process.env.PAYSTACK_SECRET;

      // Generate hash for validation
      const hash = crypto
        .createHmac("sha512", secret)
        .update(JSON.stringify(req.body))
        .digest("hex");

      if (hash !== req.headers["x-paystack-signature"]) {
        console.warn("⚠️ Invalid Paystack signature");
        return res.sendStatus(401);
      }

      const event = req.body;

      if (event.event === "charge.success") {
        const reference = event.data.reference;

        // Find payment by reference
        const payment = await Payment.findOne({ providerRef: reference });
        if (!payment) return res.sendStatus(404);

        // Update payment + appointment
        payment.status = "SUCCEEDED";
        await payment.save();

        await Appointment.findByIdAndUpdate(payment.appointmentId, {
          status: "CONFIRMED",
        });
      }

      res.sendStatus(200);
    } catch (err) {
      console.error("Webhook error:", err.message);
      res.sendStatus(500);
    }
  }
);

module.exports = router;
// End of file src/routes/BookRoutes.js
