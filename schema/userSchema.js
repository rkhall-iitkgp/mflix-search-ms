const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    dob: { type: Date, required: true },
    phone: { type: Number, required: true },
    gender: { type: String, required: true },

    payments: [{ type: mongoose.Schema.Types.ObjectId, ref: "payments" }],
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
