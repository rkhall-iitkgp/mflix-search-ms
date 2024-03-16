const mongoose = require("mongoose");
const { adminSchema } = require("../schema");
const adminModel = mongoose.model("admin", adminSchema);
module.exports = adminModel;
