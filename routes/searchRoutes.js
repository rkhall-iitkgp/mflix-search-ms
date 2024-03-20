const express = require("express");
const { AutoComplete,FuzzySearch ,SemanticSearch} = require("../controllers/search");
const router = express.Router();

router.get("/", (req, res) => {
	res.send("hello");
});

router.get("/autocomplete", AutoComplete);
router.get("/fuzzysearch",FuzzySearch);
// router.get("/populatemovies",PopulateMovies);
router.get("/semanticsearch",SemanticSearch);
module.exports = router;
