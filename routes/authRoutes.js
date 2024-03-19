const express = require("express");
const router = express.Router();

router.post("/register", (req, res) => {
  // TODO : Add schema verifications
  res.send("hello");
});

router.post("/login", (req, res) => {
  res.send("hello");
});

router.post("/verify/otp", (req, res) => {
  res.send("hello");
});

module.exports = router;
