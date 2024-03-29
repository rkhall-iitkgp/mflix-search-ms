const { Movie, User } = require("../../models");
const jwt = require("jsonwebtoken");

async function moviesbyid(req, res) {
    try {
        const { id } = req.params;
        let result = await Movie.findById(id).select(
            "-plot_embedding -fullplot_embedding -embedding",
        ).exec();
        if (req.body.userId) {
            const decoded = jwt.verify(req.cookies.accessToken, process.env.ACCESS_SECRET);

            if(!decoded) {
                return res.status(401).json({
                    status: false,
                    message: "Unauthorized",
                });
            }

            const user = await User.findById(req.body.userId).exec();
            console.log(user);
            result = result.toObject();
            result.inWatchlist = false;
            user.watchList.forEach((movie) => {
                console.log(movie, id);
                if (movie.movie.toString() === id) {
                    result.inWatchlist = true;
                }
            });
            result.inFavorites = false;
            user.favoriteMovies.forEach((movie) => {
                if (movie.movie.toString() === id) {
                    result.inFavorites = true;
                }
            })
        }
        res.status(200).json({
            status: true,
            result,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Error: " + error.message,
        });
    }
};
module.exports = moviesbyid