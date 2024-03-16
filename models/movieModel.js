const mongoose = require("mongoose");
const { movieSchema } = require("../schema");
const movieModel = mongoose.model("movies", movieSchema);
module.exports = movieModel;
