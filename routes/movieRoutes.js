const express = require("express");
const { GetAllMovies } = require("../controllers/movie");
const router = express.Router();

router.get("/", GetAllMovies);

module.exports = router;
