const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
  paymentType: { type: String, required: true, enum: ["CARD", "UPI"], default: "CARD" },
  transactionId: { type: String, required: false },
  stripeCustomerId: { type: String, required: true },
  tierId: { type: mongoose.Schema.Types.ObjectId, ref: "tier", required: true },
  expiredOn: { type: Date, required: true },
  autorenewal: { type: Boolean, required: true, default: false },
  renewalType: { type: String, enum: ["MONTHLY", "QUATERLY", "ANNUALLY"], default: "MONTHLY" },
});

module.exports = paymentSchema;
