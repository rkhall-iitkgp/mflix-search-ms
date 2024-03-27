const { User } = require("../../models");

async function addToFavourites(req, res) {
    try {
        const { movie, userId } = req.body;
        const movie_id = movie;
        const doc = await User.findOne({ _id: userId });
        const result = doc.favoriteMovies;
        result.push({ movie: movie_id });
        let newdoc = await User.findOneAndUpdate(
            { _id: userId },
            { favoriteMovies: result },
        );
        res.json(newdoc.favoriteMovies);
    } catch (error) {
        console.log("Error: ", error);
        res.json(error);
    }
}

async function deleteFromFavourites(req, res) {
    try {
        const { movie, userId } = req.body;
        const movie_id = movie;
        let newdoc = await User.findOneAndUpdate(
            { _id: userId },
            { $pull: { favoriteMovies: { movie: movie_id } } },
            { new: true },
        );
        res.json(newdoc.favoriteMovies);
    } catch (error) {
        console.log("Error: ", error);
        res.json(error);
    }
}

async function getFavourites(req, res) {
    try {
        const userId = req.query.userId;
        const result = await User.findOne({ _id: userId })
            .populate(
                "favoriteMovies.movie",
                "_id title plot genres languages year imdb tomatoes",
            )
            .exec();
        res.json(result.favoriteMovies);
    } catch (error) {
        console.log("Error: ", error);
        res.json(error);
    }
}

module.exports = { addToFavourites, deleteFromFavourites, getFavourites };
