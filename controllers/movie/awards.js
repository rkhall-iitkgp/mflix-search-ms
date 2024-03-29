const { Movie } = require("../../models");
const applyFilters = (filters) => {
    let agg = [];
    agg.push({
        $match: {
            "awards.wins": { $gt: 50 }
        }
    });

    agg.push({
        $limit: 20,
    });

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
            awards:1,
        },
    });

    return agg;
};

async function awards(req, res) {
    try {
        let { count = 20, page = 1 } = req.query;

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

        let agg = []
        // agg = [
        //     {
        //         $search: {
        //             index: "award_movies"

        //         },
        //     },
        // ];
        agg.push({
            $sort:{
                'awards.wins':-1
            }
        })
        agg = agg.concat(applyFilters());
        
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
     console.log("agg: ",agg)
        const output = (await Movie.aggregate(agg))[0];
        let results = output.results;
        const totalCount = output.totalCount[0]?.count;
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
};

module.exports = awards