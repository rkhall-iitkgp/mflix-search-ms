const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    moviesWatched: [
        {
            movie: { type: mongoose.Schema.Types.ObjectId, ref: "movies" },
            durationWatched: { type: Number },
        },
    ],

    watchList: [{ type: mongoose.Schema.Types.ObjectId, ref: "movies" }],
    favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "movies" }],
    savedFilters: [
        {
            name: { type: String },
            filters: { type: Object },
        },
    ],
});

module.exports = userSchema;
