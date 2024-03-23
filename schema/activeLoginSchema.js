const mongoose = require("mongoose");

const activeLoginSchema = mongoose.Schema({
    account: { type: mongoose.Schema.Types.ObjectId, ref: "accounts" },
    loginTime: { type: Date },
    logoutTime: { type: Date },
    ipAddress: { type: String },
    userAgent: { type: String },
    isActive: { type: Boolean },
});

module.exports = activeLoginSchema;
