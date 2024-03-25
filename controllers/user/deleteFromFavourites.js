const { User } = require("../../models");
async function deleteFromFavourites(req, res) {
    try {
        const { movie, userId } = req.body
        const movie_id = movie;
        let newdoc = await User.findOneAndUpdate({ _id: userId },
            { $pull: { favoriteMovies: { movie: movie_id } } },
            { new: true });
        res.json(newdoc.favoriteMovies)
    } catch (error) {
        console.log("Error: ", error);
        res.json(error)
    }
}

module.exports = deleteFromFavourites