const mongoose = require("mongoose");
const { accountSchema } = require("../schema");
const accountModel = mongoose.model("account", accountSchema);
module.exports = accountModel;
