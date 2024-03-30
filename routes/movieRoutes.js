const express = require("express");
const { GetAllMovies, GetMovieById ,GetByAwards, GetVideoLink} = require("../controllers/movie");
const {auth} = require("../middlewares");
const router = express.Router();

router.get("/", GetAllMovies);
router.get("/awards", GetByAwards);
router.get("/:id", GetMovieById);
router.get("/:id/link",auth, GetVideoLink)

module.exports = router;
