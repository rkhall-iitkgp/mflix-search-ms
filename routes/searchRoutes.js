const express = require("express");
const { AutoComplete, FuzzySearch, SemanticSearch, DeleteFilter, CreateFilter, InitialFilter, GetFilter } = require("../controllers/search");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("hello");
});

router.get("/autocomplete", AutoComplete);
router.get("/filter", InitialFilter);
router.post("/filter", CreateFilter);
router.post("/filter/getanddelete", DeleteFilter);
router.get("/filter/getanddelete", GetFilter);
router.post("/fuzzy", FuzzySearch);
router.post("/semantic", SemanticSearch);
// router.post("/newMovie",newMovieEmbed);
module.exports = router;
