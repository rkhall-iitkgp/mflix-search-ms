const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    moviesWatched: [
        {
            movie: { type: mongoose.Schema.Types.ObjectId, ref: "movies" },
            durationWatched: { type: Number },
        },
    ],
    watchList: [
        { movie: { type: mongoose.Schema.Types.ObjectId, ref: "movies" } },
    ],
    favoriteMovies: [
        { movie: { type: mongoose.Schema.Types.ObjectId, ref: "movies" } },
    ],
    savedFilters: [
        {
            name: { type: String },
            filters: { type: Object },
        },
    ],
    searchHistory: [
        {
            name: { type: String },
            query: { type: String },
        },
    ],
});

module.exports = userSchema;
