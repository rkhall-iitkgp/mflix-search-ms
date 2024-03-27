const { Movie } = require("../../models");
const { saveSearch } = require("../user");

const applyFilters = (filters) => {
    let agg = [];
    if (filters.year.start && filters.year.end) {
        agg.push({
            $match: {
                year: {
                    $gte: parseInt(filters.year.start),
                    $lte: parseInt(filters.year.end),
                },
            },
        });
    }

    if (filters.rating.low && filters.rating.high) {
        agg.push({
            $match: {
                "imdb.rating": {
                    $gte: parseFloat(filters.rating.low),
                    $lte: parseFloat(filters.rating.high),
                },
            },
        });
    }

    if (filters.languages.length > 0) {
        agg.push({
            $match: {
                languages: {
                    $in: [filters.languages],
                },
            },
        });
    }

    if (filters.countries.length > 0) {
        agg.push({
            $match: {
                countries: {
                    $in: [filters.countries],
                },
            },
        });
    }

    if (filters.genres.length > 0) {
        agg.push({
            $match: {
                genres: {
                    $in: [filters.genres],
                },
            },
        });
    }

    if (filters.type.length > 0) {
        agg.push({
            $match: {
                type: {
                    $in: [filters.type],
                },
            },
        });
    }

    agg.push({
        $limit: 10,
    });

    agg.push({
        $project: {
            score: { $meta: "searchScore" },
            _id: 1,
            poster: 1,
            title: 1,
            genres: 1,
            "imdb.rating": 1,
            "tomatoes.viewer.rating": 1,
            released: 1,
            runtime: 1,
            countries: 1,
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
            start,
            end,
            low,
            high,
            language,
            country,
            genre,
            type,
        } = req.query;
        let { userId } = req.body;

        let filters = {
            year: {
                start: start || 0,
                end: end || 2024,
            },
            rating: {
                low: low || 0,
                high: high || 10,
            },
            languages: language || "",
            countries: country || "",
            genres: genre || "",
            type: type || "",
        };

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

        console.log(agg);

        const output = (await Movie.aggregate(agg))[0];
        let results = output.results;
        const totalCount = output.totalCount[0]?.count;
        if (userId != null) saveSearch(userId, 0, query);
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
