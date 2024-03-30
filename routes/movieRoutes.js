const express = require("express");
const { GetAllMovies, GetMovieById ,GetByAwards, GetVideoLink} = require("../controllers/movie");
const router = express.Router();

router.get("/", GetAllMovies);
router.get("/:id", GetMovieById);
router.get("/awards", GetByAwards);
router.get("/:id/link", GetVideoLink)

module.exports = router;
