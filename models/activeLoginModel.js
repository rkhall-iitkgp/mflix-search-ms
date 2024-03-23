const mongoose = require("mongoose");
const { activeLoginSchema } = require("../schema");
const activeLoginModel = mongoose.model("activeLogin", activeLoginSchema);
module.exports = activeLoginModel;
