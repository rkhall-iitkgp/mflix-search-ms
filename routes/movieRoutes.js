const express = require("express");
const { GetAllMovies, GetMovieById } = require("../controllers/movie");
const router = express.Router();

router.get("/", GetAllMovies);
router.get("/:id", GetMovieById);

module.exports = router;
