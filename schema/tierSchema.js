const mongoose = require("mongoose");

const tierSchema = mongoose.Schema({
  tier: {
    type: String,
    enum: ["TIER 1", "TIER 2", "TIER 3", "FREE"],
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  maxResolution: {
    type: Number,
    required: true,
    default: 480,
    enum: [144, 240, 360, 480, 720, 1080],
  },
  partyWatch: { type: Boolean, default: false },
});

module.exports = tierSchema;
