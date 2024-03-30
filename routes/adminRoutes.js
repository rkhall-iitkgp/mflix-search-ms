const router = require("express").Router();
const { getMoviesbypage, createMovie, updateMovie, deleteMovie, newMovieEmbed } = require("../controllers/admin");
const { validateMovie } = require("../middlewares/admin/validation");

router.get("/", (req, res) => {
  res.send("Let's build a CRUD API!");
});

router.get("/movies/:page", getMoviesbypage);
router.post("/movies", validateMovie, createMovie);
router.put("/movies/:id", validateMovie, updateMovie);
router.delete("/movies/:id", deleteMovie);
router.post("/newMovie",newMovieEmbed);



module.exports = router;
