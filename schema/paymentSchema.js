const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "accounts",
    },
    paymentType: {
        type: String,
        required: true,
        enum: ["CARD", "UPI"],
        default: "CARD",
    },
    transactionId: { type: String, required: false },
    stripeCustomerId: { type: String, required: true },
    tierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tier",
        required: true,
    },
    expiredOn: { type: Date, required: false },
    autorenewal: { type: Boolean, required: true, default: false },
    renewalType: {
        type: String,
        enum: ["MONTHLY", "QUATERLY", "ANNUALLY"],
        default: "MONTHLY",
    },
});

module.exports = paymentSchema;
