const express = require("express");
const {
    AutoComplete,
    FuzzySearch,
    SemanticSearch,
} = require("../controllers/search");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("hello");
});

router.get("/autocomplete", AutoComplete);
router.get("/fuzzy", FuzzySearch);
router.get("/semantic", SemanticSearch);
// router.post("/newMovie",newMovieEmbed);
module.exports = router;
