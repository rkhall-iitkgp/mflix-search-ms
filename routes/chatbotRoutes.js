const express = require("express");
const router = express.Router();
const { modelResponse } = require("../controllers/chatbot");
router.post("/message", modelResponse);
module.exports = router;
