const { refresh } = require("../../middlewares/authMiddle");
const { Movie, User } = require("../../models");
const jwt = require("jsonwebtoken");

async function moviesbyid(req, res) {
    try {
        const { id } = req.params;
        let result = await Movie.findById(id)
            .select("-plot_embedding -fullplot_embedding -embedding")
            .exec();
        if (req.body.userId) {
            let token = req.cookies.accessToken;
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                res.clearCookie("accessToken");
                return res.status(200).json({
                    status: true,
                    result,
                });
            }

            if (!token) {
                const refreshResponse = await refresh(refreshToken);
                if (!refreshResponse.success) {
                    res.clearCookie("refreshToken");
                    return res.status(200).json({
                        status: true,
                        result,
                    });
                }

                res.cookie("accessToken", refreshResponse.token, {
                    expires: new Date(Date.now() + 60 * 60 * 1000),
                    httpOnly: true,
                    // secure: process.env.DEPLOYMENT === "local" ? false : true,
                });

                token = refreshResponse.token;
            }

            const decoded = jwt.verify(
                req.cookies.accessToken,
                process.env.ACCESS_SECRET,
            );

            if (!decoded) {
                return res.status(200).json({
                    status: true,
                    result,
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
            });
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

}
module.exports = moviesbyid;
