const express = require("express");
const {
    GetAllMovies,
    GetMovieById,
    GetByAwards,
    GetVideoLink,
} = require("../controllers/movie");
const { auth } = require("../middlewares");
const router = express.Router();

router.get("/", GetAllMovies);
router.get("/awards", GetByAwards);
router.get("/link/:id", GetVideoLink);
router.post("/:id", GetMovieById);

module.exports = router;
