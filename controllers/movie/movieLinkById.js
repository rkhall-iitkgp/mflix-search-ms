const { refresh } = require("../../middlewares");
const { Movie, Account } = require("../../models");
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Movie.findById(id).select({
            uploadurl: 1,
            tier: 1,
        });
        // console.log("result", result);
        const movie = result.toObject();
        // console.log("movie", movie);
        let token = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;
        console.log("token,refreshToken", token, refreshToken);
        if (!refreshToken || !token) {
            if (movie.tier.toLowerCase() === "free")
                return res.status(200).json({
                    success: true,
                    result: result,
                });
            else {
                console.log("result11", movie.uploadurl.trailersrc);

                return res.status(200).json({
                    success: false,
                    message:
                        "Please Login to Premium Account to watch this movie",
                    result: movie.uploadurl.trailersrc,
                });
            }
        }

        const user = jwt.verify(token, process.env.ACCESS_SECRET);
        if (!user) {
            console.log("result1", movie);

            return res.status(200).json({
                success: false,
                message:
                    "Unauthorized access, please login to access this content",
                result: movie.uploadurl.trailersrc,
            });
        }
        let account = await Account.findById(user.id)
            .populate({
                path: "subscriptionTier",
                populate: { path: "tier", model: "tiers" },
            })
            .exec();

        account = account.toObject();

        if (account.subscriptionTier.tier.name === "Premium") {
            res.status(200).json({
                status: true,
                result,
            });
        } else {
            if (movie.tier.toLowerCase() === "free") {
                res.status(200).json({
                    status: true,
                    result,
                });
            } else {
                res.status(200).json({
                    status: false,
                    message: "Upgrade you tier to enjoy this movie",
                    result: result.uploadurl.trailersrc,
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Error: " + error.message,
        });
    }
};
