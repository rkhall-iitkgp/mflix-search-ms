const { Movie } = require("../../models");

async function FuzzySearch(req, res) {
    try {
        const { query } = req.query;

        if (!query || query.length < 3) {
            return res.status(400).json({
                status: false,
                message: "Error: " + "Query length is too small",
            });
        }

        const agg = [
            {
                $search: {
                    index: "autocomplete",
                    compound: {
                        should: [
                            {
                                autocomplete: {
                                    path: "title",
                                    query: query,
                                    fuzzy: {
                                        maxEdits: 2,
                                        prefixLength: 0,
                                        maxExpansions: 10,
                                    },
                                },
                            },
                            {
                                autocomplete: {
                                    path: "directors",
                                    query: query,
                                    fuzzy: {
                                        maxEdits: 1,
                                        prefixLength: 0,
                                        maxExpansions: 10,
                                    },
                                },
                            },
                            {
                                autocomplete: {
                                    path: "cast",
                                    query: query,
                                    fuzzy: {
                                        maxEdits: 1,
                                        prefixLength: 0,
                                        maxExpansions: 10,
                                    },
                                },
                            },
                        ],
                    }
                },
            },
            {
                $limit: 10,
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
    } catch {
        console.log("Error: ", error);
        res.status.json({
            status: false,
            message: "Error: " + error.message,
        });
    }
}

module.exports = FuzzySearch;