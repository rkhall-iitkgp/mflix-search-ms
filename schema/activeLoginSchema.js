const mongoose = require("mongoose");

const activeLoginSchema = mongoose.Schema({
    account: { type: mongoose.Schema.Types.ObjectId, ref: "accounts" },
    sessionId: { type: String },
    loginTime: { type: Date },
    ipAddress: { type: String },
    userAgent: { type: String },
});

module.exports = activeLoginSchema;
