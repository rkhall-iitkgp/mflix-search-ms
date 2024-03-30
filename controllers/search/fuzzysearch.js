const { Movie } = require("../../models");
const { saveSearch } = require("../user");

const applyFilters = (filters) => {
    let agg = [];
    if (filters.year && filters.year.start && filters.year.end) {
        agg.push({
            $match: {
                year: {
                    $gte: parseInt(filters.year.start),
                    $lte: parseInt(filters.year.end),
                },
            },
        });
    }

    if (filters.rating && filters.rating.low && filters.rating.high) {
        agg.push({
            $match: {
                "imdb.rating": {
                    $gte: parseFloat(filters.rating.low),
                    $lte: parseFloat(filters.rating.high),
                },
            },
        });
    }

    if (filters.languages && filters.languages.length > 0) {
        agg.push({
            $match: {
                languages: {
                    $in: filters.languages
                },
            },
        });
    }

    if (filters.countries && filters.countries.length > 0) {
        agg.push({
            $match: {
                countries: {
                    $in: filters.countries,
                },
            },
        });
    }

    if (filters.genres && filters.genres.length > 0) {
        agg.push({
            $match: {
                genres: {
                    $in: filters.genres,
                },
            },
        });
    }

    if (filters.type && filters.type.length > 0) {
        agg.push({
            $match: {
                type: {
                    $in: [filters.type],
                },
            },
        });
    }

    agg.push({
        $project: {
            score: { $meta: "searchScore" },
            _id: 1,
            poster: 1,
            title: 1,
            genres: 1,
            "imdb.rating": 1,
            "tomatoes.viewer.meter": 1,
            released: 1,
            runtime: 1,
            countries: 1,
            tier: 1,
            languages: 1,
        },
    });

    return agg;
};

async function FuzzySearch(req, res) {
    try {
        let {
            query,
            count = 10,
            page = 1,
        } = req.query;
        let { userId, filters } = req.body;
        if(!filters) filters = {};

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

        let agg = [];

        if (!query) {
            agg = applyFilters(filters);
            agg.push({
                $facet: {
                    results: [{ $skip: skip }, { $limit: count }],
                    totalCount: [
                        {
                            $count: "count",
                        },
                    ],
                },
            });
        } else {
            agg = [
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
                                            maxEdits: 1,
                                            prefixLength: 3,
                                            maxExpansions: 50,
                                        },
                                    },
                                },
                                {
                                    autocomplete: {
                                        path: "directors",
                                        query: query,
                                        fuzzy: {
                                            maxEdits: 2,
                                            prefixLength: 3,
                                            maxExpansions: 50,
                                        },
                                    },
                                },
                                {
                                    autocomplete: {
                                        path: "cast",
                                        query: query,
                                        fuzzy: {
                                            maxEdits: 2,
                                            prefixLength: 3,
                                            maxExpansions: 50,
                                        },
                                    },
                                },
                            ],
                        },
                    },
                },
            ];

            agg = agg.concat(applyFilters(filters));

            agg.push({
                $facet: {
                    results: [{ $skip: skip }, { $limit: count }],
                    totalCount: [
                        {
                            $count: "count",
                        },
                    ],
                },
            });
        }

        const output = (await Movie.aggregate(agg))[0];
        let results = output.results;
        const totalCount = output.totalCount[0]?.count;
        if (!userId) saveSearch(userId, 0, query);
        if (!totalCount || isNaN(totalCount))
            return res.status(200).json({
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
