const checkout = require("./checkout");
const webhook = require("./webhook");
const {getPaymentDetails} = require("./details");
module.exports = {
    checkout,
    webhook,
    getPaymentDetails
};
