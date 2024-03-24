const { Movie } = require("../../models");

async function AutoComplete(req, res) {
    try {
        let { query, count = 5 } = req.query;

        if (!query || query.length < 3) {
            return res.status(400).json({
                status: false,
                message: "Error: " + "Query length is too small",
            });
        }

        if (isNaN(parseInt(count)) || parseInt(count) <= 0) {
            return res.status(400).json({
                status: false,
                message: "Error: " + "Invalid count or page parameters",
            });
        }

        count = parseInt(count);

        const agg = [
            {
                $search: {
                    index: "autocomplete",
                    compound: {
                        should: [
                            {
                                autocomplete: {
                                    query: query,
                                    path: "title",
                                },
                            },
                            {
                                autocomplete: {
                                    query: query,
                                    path: "directors",
                                },
                            },
                            {
                                autocomplete: {
                                    query: query,
                                    path: "cast",
                                },
                            },
                        ],
                        minimumShouldMatch: 1,
                    },
                },
            },
            {
                $limit: count,
            },
            {
                $project: {
                    _id: 0,
                    title: 1,
                    plot: 1,
                    score: { $meta: "searchScore" },
                },
            },
        ];
        // run pipelines
        const result = await Movie.aggregate(agg);

        // print results
        res.status(200).json({
            status: true,
            result,
        });
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({
            status: false,
            message: "Error: " + error.message,
        });
    }
}

module.exports = AutoComplete;
