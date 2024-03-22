const mongoose = require("mongoose");

const accountSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: {
      validator: function (email) {
        // Regular expression to validate email format
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
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

  userProfiles: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
});

module.exports = accountSchema;
