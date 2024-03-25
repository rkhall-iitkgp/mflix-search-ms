const { User } = require("../../models");
async function deleteFromWatchlist(req, res) {
    try {
        const { movie, userId } = req.body
        const movie_id = movie;
        let newdoc = await User.findOneAndUpdate({ _id: userId },
            { $pull: { watchList: { movie: movie_id } } },
            { new: true });
        res.json(newdoc.watchList)
    } catch (error) {
        console.log("Error: ", error);
        res.json(error)
    }
}

module.exports = deleteFromWatchlist