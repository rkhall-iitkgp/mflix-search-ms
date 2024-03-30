const { Movie, Account } = require("../../models");

module.exports = async (req, res) => {
    try {
        const { user } = req;
        let account = await Account.findById(req.user.id)
            .populate({
                path: "subscriptionTier",
                populate: { path: "tier", model: "tiers" }
            })
            .exec()

        account = account.toObject();
        if (account.subscriptionTier.tier.name === "Premium") {
            const { id } = req.params;
            const result = await Movie.findById(id)
                .select({
                    videoSrc: 1
                }).exec();


            res.status(200).json({
                status: true,
                result
            });

        } else {
            res.status(200).json({
                status: true,
                result: {}
            });

        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Error: " + error.message
        });
    }
};
