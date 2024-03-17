const express = require("express");
const { AutoComplete,FuzzySearch } = require("../controllers/search");
const router = express.Router();

router.get("/", (req, res) => {
	res.send("hello");
});

router.get("/autocomplete", AutoComplete);
router.get("/fuzzysearch",FuzzySearch);
module.exports = router;
