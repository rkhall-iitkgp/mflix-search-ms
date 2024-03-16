const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  dob: { type: Date, required: true },
  phone: { type: Number, required: true },
  gender: { type: String, required: true },
});

module.exports = adminSchema;
