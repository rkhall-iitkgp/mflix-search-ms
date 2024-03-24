const { Movie } = require("../../models");

async function FuzzySearch(req, res) {
    try {
        let { query, count = 10, page = 1 } = req.query;

        if (!query || query.length < 3) {
            return res.status(400).json({
                status: false,
                message: "Error: " + "Query length is too small",
            });
        }

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
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    plot: 1,
                    score: { $meta: "searchScore" },
                    imdb: 1,
                    tomatoes: 1,
                    genre: 1,
                    country: 1,
                    release: 1,
                },
            },
            {
                $facet: {
                    results: [{ $skip: skip }, { $limit: count }],
                    totalCount: [
                        {
                            $count: "count",
                        },
                    ],
                },
            },
        ];

        // run pipelines
        const output = (await Movie.aggregate(agg))[0];
        let results = output.results;
        const totalCount = output.totalCount[0]?.count;
        if (!totalCount || isNaN(totalCount)) return res.status(200).json({
            status: true,
            result: [],
            message: "Error: " + "No Result Found",
        });
        const currCount = page * count;

        res.status(200).json({
            status: true,
            results,
            hasNext: currCount < totalCount,
        });
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({
            status: false,
            message: "Error: " + error.message,
        });
    }
}

module.exports = FuzzySearch;
