const express = require("express");
const { TrendingMovies, MyList } = require("../controllers/movie");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("hello");
});

router.get("/trending", TrendingMovies);
router.get("/mylist", MyList);

module.exports = router;
