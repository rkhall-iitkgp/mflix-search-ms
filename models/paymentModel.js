const mongoose = require("mongoose");
const { paymentSchema } = require("../schema");
const paymentModel = mongoose.model("payments", paymentSchema);
module.exports = paymentModel;
