const mongoose = require("mongoose");
const { tierSchema } = require("../schema");
const tierModel = mongoose.model("tiers", tierSchema);
module.exports = tierModel;
