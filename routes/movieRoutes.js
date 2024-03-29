const express = require("express");
const { GetAllMovies, GetMovieById ,GetByAwards} = require("../controllers/movie");
const router = express.Router();

router.get("/", GetAllMovies);
router.get("/awards", GetByAwards);
router.post("/:id", GetMovieById);

module.exports = router;
