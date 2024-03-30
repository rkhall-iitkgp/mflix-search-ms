const express = require("express");
const { GetAllMovies, GetMovieById, GetVideoLink } = require("../controllers/movie");
const router = express.Router();

router.get("/", GetAllMovies);
router.get("/:id", GetMovieById);
router.get("/:id/link", GetVideoLink)

module.exports = router;
