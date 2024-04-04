const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares");

const {
    sendOTP,
    login,
    verifyOTP,
    logout,
    getActiveLogins,
    removeActiveLogin,
    verify,
    resendOTP
} = require("../controllers/auth");

router.post("/login", login);
router.post("/sendOTP", sendOTP);
router.post("/verifyOTP", verifyOTP);
router.post("/logout", auth, logout);
router.post("/removeActiveLogin", auth, removeActiveLogin);
router.get("/getActiveLogins", auth, getActiveLogins);
router.get("/verify", verify);
router.post("/resendOTP", resendOTP)

module.exports = router;
