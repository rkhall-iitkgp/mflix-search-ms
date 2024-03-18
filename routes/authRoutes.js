const express = require("express");
const router = express.Router();

router.post("/register", (req, res) => {
  // TODO : Add schema verifications
  res.send("hello");
});
const {auth} = require('../middlewares')
const {updatePasswordOTP, verifyOTPUpdatePassword, signup, sendotp, login} = require('../controllers/auth');

router.post('/login', login)
router.post('/signup', signup)
router.post('/signup/sendotp', sendotp)
router.post("/user/password", auth, updatePasswordOTP);
router.patch("/user/password/verifyOTP", auth, verifyOTPUpdatePassword);



module.exports = router;
