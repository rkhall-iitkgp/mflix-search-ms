const mongoose = require("mongoose");

const accountSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  dob: { type: Date, required: false },
  phone: { type: Number, required: false },
  gender: { type: String, required: false },

  subscriptionTier: {
    tier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tier",
      required: false,
    },
    bill: { type: mongoose.Schema.Types.ObjectId, ref: "payments" },
  },

  payments: [{ type: mongoose.Schema.Types.ObjectId, ref: "payments" }],
});

module.exports = accountSchema;
