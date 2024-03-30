const { Movie, Account } = require("../../models");

module.exports = async (req, res) => {
    try {
        const result = await Movie.findById(id)
            .select({
                videoSrc: 1,
            })
            .exec();
        const movie = result.toObject();
        let token = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            if (movie.tier.toLowerCase() === "free")
                return res.status(200).json({
                    success: true,
                    result: result,
                });
        }

        if (!token) {
            const refreshResponse = await refresh(refreshToken);
            if (!refreshResponse.success) {
                res.clearCookie("refreshToken");
                return res.status(401).json({
                    success: false,
                    message: refreshResponse.message,
                });
            }

            res.cookie("accessToken", refreshResponse.token, {
                expires: new Date(Date.now() + 60 * 60 * 1000),
                httpOnly: true,
                // secure: process.env.DEPLOYMENT === "local" ? false : true,
            });

            token = refreshResponse.token;
        }

        const user = jwt.verify(token, process.env.ACCESS_SECRET);

        let account = await Account.findById(user.id)
            .populate({
                path: "subscriptionTier",
                populate: { path: "tier", model: "tiers" },
            })
            .exec();

        account = account.toObject();

        const { id } = req.params;

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
                    result: null,
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
