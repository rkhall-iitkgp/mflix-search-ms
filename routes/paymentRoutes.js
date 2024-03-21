const express = require("express");
const { checkout, webhook } = require("../controllers/payment");
const router = express.Router();

//checkout payment
router.post("/create-checkout-session", checkout);
//for stripe webhook
router.post("/stripe/webhook", express.raw({ type: 'application/json' }), webhook);
// //check payment status
// router.get("/status")

module.exports = router;
