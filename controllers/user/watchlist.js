const { User } = require("../../models");

async function addToWatchlist(req, res) {
    try {
        const { movie, userId } = req.body;
        const movie_id = movie;
        const doc = await User.findOne({ _id: userId });
        const result = doc.watchList;
        result.push({ movie: movie_id });
        let newdoc = await User.findOneAndUpdate(
            { _id: userId },
            { watchList: result },
        );
        res.json(newdoc.watchList);
    } catch (error) {
        console.log("Error: ", error);
        res.json(error);
    }
}

async function deleteFromWatchlist(req, res) {
    try {
        const { movie, userId } = req.body;
        const movie_id = movie;
        let newdoc = await User.findOneAndUpdate(
            { _id: userId },
            { $pull: { watchList: { movie: movie_id } } },
            { new: true },
        );
        res.json(newdoc.watchList);
    } catch (error) {
        console.log("Error: ", error);
        res.json(error);
    }
}

async function getWatchlist(req, res) {
    try {
        const userId = req.params.userId;
        const result = await User.findOne({ _id: userId })
            .populate(
                "watchList.movie",
                "_id title plot genres languages year imdb tomatoes",
            )
            .exec();
        res.json(result.watchList);
    } catch (error) {
        console.log("Error: ", error);
        res.json(error);
    }
}

module.exports = { addToWatchlist, deleteFromWatchlist, getWatchlist };
