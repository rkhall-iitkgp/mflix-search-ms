const { User } = require("../../models");
async function getWatchHistory(req, res) {
    try {
        const userId = req.query.userId;
        const result = await User.findOne({ _id: userId })
            .populate(
                "moviesWatched.movie",
                "_id title plot genres languages year imdb tomatoes",
            )
            .exec();
        res.json(result.moviesWatched);
    } catch (error) {
        console.log("Error: ", error);
        res.json(error);
    }
}

async function saveWatchHistory(req, res) {
    try {
        const { movie, watchdurn, userId } = req.body;
        const doc = await User.findOne({ _id: userId });
        const movie_id = movie._id.$oid;
        const result = doc.moviesWatched;
        result.push({
            movie: movie_id,
            durationWatched: watchdurn,
        });
        let newdoc = await User.findOneAndUpdate(
            { _id: userId },
            { moviesWatched: result },
        );
        res.json(newdoc);
    } catch (error) {
        console.log("Error: ", error);
        res.json(error);
    }
}

module.exports = { getWatchHistory, saveWatchHistory };
