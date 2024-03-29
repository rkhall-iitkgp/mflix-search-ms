const express = require("express");
const { GetAllMovies, GetMovieById ,GetByAwards} = require("../controllers/movie");
const router = express.Router();

router.get("/", GetAllMovies);
router.get("/awards", GetByAwards);
router.get("/:id", GetMovieById);

module.exports = router;
