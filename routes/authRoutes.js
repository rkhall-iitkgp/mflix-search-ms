const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares");

const { sendOTP, login, verifyOTP, logout } = require("../controllers/auth");

// login into application
router.post("/login", login);
// send otp for Register and Reset Password
router.post("/sendOTP", sendOTP);
// verify otp for Register and Reset Password
router.post("/verifyOTP", verifyOTP);
router.post("/logout", auth, logout);

module.exports = router;
