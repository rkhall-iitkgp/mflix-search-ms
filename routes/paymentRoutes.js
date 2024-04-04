const express = require("express");
const { checkout, webhook, getPaymentDetails } = require("../controllers/payment");
const { auth } = require("../middlewares");
const router = express.Router();

//checkout payment
router.post("/create-checkout-session", auth, checkout);
//for stripe webhook
router.post(
    "/stripe/webhook",
    express.raw({ type: "application/json" }),
    webhook,
);

router.get("/details", getPaymentDetails);
// //check payment status
// router.get("/status")

module.exports = router;
