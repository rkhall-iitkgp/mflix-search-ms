const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  dob: { type: Date, required: true },
  phone: { type: Number, required: true },
  gender: { type: String, required: true },

  subscriptionTier: {
    tier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tier",
      required: true,
    },
    bill: { type: mongoose.Schema.Types.ObjectId, ref: "payments" },
  },

  payments: [{ type: mongoose.Schema.Types.ObjectId, ref: "payments" }],
  moviesWatched: [
    {
      movie: { type: mongoose.Schema.Types.ObjectId, ref: "movies" },
      durationWatched: { type: Number },
    },
  ],

  watchList: [{ type: mongoose.Schema.Types.ObjectId, ref: "movies" }],
});

module.exports = userSchema;
