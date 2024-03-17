const express = require("express");
const { AutoComplete } = require("../controllers/search");
const router = express.Router();

router.get("/", (req, res) => {
	res.send("hello");
});

router.get("/autocomplete", AutoComplete);

module.exports = router;
