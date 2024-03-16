const mongoose = require("mongoose");
const { userSchema } = require("../schema");
const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
