const mongoose = require("mongoose");

const movieSchema = mongoose.Schema({
  plot: { type: String, required: true },
  videoSrc: { type: String, required: true },
  genre: [{ type: String, required: true }],
  runtime: { type: Number, required: true },
  rated: { type: String, required: true },
  cast: [{ type: String, required: true }],
  title: { type: String, required: true },
  fullPlot: { type: String, required: true },
  languages: [{ type: String, required: true }],
  released: { type: Date, required: true },
  directors: [{ type: String, required: true }],
  writers: [{ type: String, required: true }],
  awards: { wins: Number, nominations: Number, text: String },
  lastUpdated: { type: Date, required: true },
  year: { type: Number, required: true },
  imdb: {
    rating: { type: Number, required: true },
    votes: { type: Number, required: true },
    id: { type: Number, required: true },
  },
  countries: [{ type: String, required: true }],
  type: { type: String, required: true },
  num_mflix_comments: { type: Number, required: true },
  tomatoes: {
    viewer: {
      rating: { type: Number, required: true },
      numReviews: { type: Number, required: true },
      meter: { type: Number, required: true },
    },
    dvd: { type: Date, required: true },
    lastupdated: { type: Date, required: true },
  },
});

module.exports = movieSchema;
