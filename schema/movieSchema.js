const mongoose = require("mongoose");

const movieSchema = mongoose.Schema({
  plot: { type: String },
  videoSrc: { type: String },
  genres: [{ type: String }],
  runtime: { type: Number },
  rated: { type: String },
  cast: [{ type: String }],
  title: { type: String },
  fullplot: { type: String },
  languages: [{ type: String }],
  released: { type: Date },
  directors: [{ type: String }],
  writers: [{ type: String }],
  awards: { wins: Number, nominations: Number, text: String },
  lastUpdated: { type: Date },
  year: { type: String },
  imdb: {
    rating: { type: Number },
    votes: { type: Number },
    id: { type: Number },
  },
  countries: [{ type: String }],
  type: { type: String },
  num_mflix_comments: { type: Number },
  tomatoes: {
    viewer: {
      rating: { type: Number },
      numReviews: { type: Number },
      meter: { type: Number },
    },
    critic: {
      rating: { type: Number },
      numReviews: { type: Number },
      meter: { type: Number },
    },
    rotten:{ type: Number },
    fresh:{ type: Number },
    dvd: { type: Date },
    lastupdated: { type: Date },
  },
  poster: { type: String },

});

module.exports = movieSchema;
