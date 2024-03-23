const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: { type: String },
    moviesWatched: [
        {
            movie: { type: mongoose.Schema.Types.ObjectId, ref: "movies" },
            durationWatched: { type: Number },
        },
    ],
    watchList: [{ type: mongoose.Schema.Types.ObjectId, ref: "movies" }],
    favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "movies" }],
});

module.exports = userSchema;
