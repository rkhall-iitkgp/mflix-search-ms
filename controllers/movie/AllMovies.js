const { Movie } = require("../../models");

module.exports = async (req, res) => {
    try {
        let { count = 10, page = 1 } = req.query;

        if (
            isNaN(parseInt(count)) ||
            parseInt(count) <= 0 ||
            isNaN(parseInt(page)) ||
            parseInt(page) <= 0
        ) {
            return res.status(400).json({
                status: false,
                message: "Error: " + "Invalid count or page parameters",
            });
        }
        count = parseInt(count);
        page = parseInt(page);
        const skip = (page - 1) * count;

        const totalCount = await Movie.countDocuments({});
        const currCount = page * count;

        const result = await Movie.find({})
            .find({})
            .skip(skip)
            .limit(count)
            .select({
                _id: 1,
                title: 1,
                plot: 1,
                imdb: 1,
                tomatoes: 1,
                genre: 1,
                country: 1,
                release: 1
            })
            .exec();
        res.status(200).json({
            status: true,
            result,
            hasNext: totalCount > currCount,
        });
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({
            status: false,
            message: "Error: " + error.message,
        });
    }
};
