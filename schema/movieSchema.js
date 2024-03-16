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
  imdb: { rating: Number, votes: Number, id: Number },
  countries: [{ type: String }],
  type: { type: String },
  num_mflix_comments: { type: Number, required: true },
  tomatoes: {
    viewer: {
      rating: { type: Number },
      numReviews: { type: Number },
      meter: { type: Number },
    },
    dvd: { type: Date },
    lastupdated: { type: Date },
  },
});

module.exports = movieSchema;
