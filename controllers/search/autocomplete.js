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
                    "highlight": {
                        "path": ["title", "directors", "cast"]
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
                    highlights: { $meta: "searchHighlights" },
                    score: { $meta: "searchScore" },
                },
            },
        ];
        const result = await Movie.aggregate(agg);

        dist = {}
        let results = []
        result.forEach((movie) => {
            const highlights = movie.highlights;
            let maxScore = 0;
            let maxPath = "";
            let maxText = "";
            highlights.forEach((highlight) => {
                if (highlight.score > maxScore) {
                    maxScore = highlight.score;
                    maxPath = highlight.path;
                    maxText = "";
                    highlight.texts.forEach((text) => {
                        maxText += text.value ;
                    });
                }
            });
            if(!dist[maxText]){
                dist[maxText] = 1;
                movie.highlight = {
                    path: maxPath,
                    text: maxText,
                };
                delete movie.highlights;
                results.push(movie);
            }
        });

        res.status(200).json({
            status: true,
            result: results,
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