const express = require("express");
const { newMovieEmbed } = require("../controllers/admin");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("hello");
});
router.post("/newMovie", newMovieEmbed);
module.exports = router;
