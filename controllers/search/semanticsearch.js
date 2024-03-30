const { Movie } = require("../../models");
const { getEmbedding } = require("../../ml_model");
const { saveSearch } = require("../user");
async function findSimilarDocuments(embedding, count, page, skip, filters) {
    try {
        const queryVector = Array.from(embedding.data);

        let agg = [
            {
                $vectorSearch: {
                    queryVector: queryVector,
                    path: "embedding",
                    numCandidates: 1000,
                    limit: 25,
                    index: "semantic_search",
                },
            },
            {
                $project: {
                    score: { $meta: "vectorSearchScore" },
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
        let filter = {};

        if (filters.year && filters.year.length > 0) {
            filter["year"] = {
                $gte: parseInt(filters.year.start),
                $lte: parseInt(filters.year.end),
            };
        }

        if (filters.rating && filters.rating.low && filters.rating.high) {
            filter["imdb.rating"] = {
                $gt: parseFloat(filters.rating.low),
                $lt: parseFloat(filters.rating.high),
            };
        }

        if (filters.languages && filters.languages.length > 0) {
            filter["languages"] = { $in: filters.languages };
        }

        if (filters.countries && filters.countries.length > 0) {
            filter["countries"] = { $in: filters.countries };
        }

        if (filters.genres && filters.genres.length > 0) {
            filter["genres"] = { $in: filters.genres };
        }

        if (filters.type && filters.type.length > 0) {
            filter["type"] = { $in: [filters.type] };
        }

        if (Object.keys(filter).length > 0) {
            agg[0]["$vectorSearch"]["filter"] = {
                $and: Object.entries(filter).map(([key, value]) => ({
                    [key]: value,
                })),
            };
        }

        console.log(agg)


        const output = (await Movie.aggregate(agg))[0];
        let results = output.results;

        const totalCount = output.totalCount[0]?.count;
        if (!totalCount || isNaN(totalCount)) return totalCount;
        const currCount = page * count;

        return { results, hasNext: currCount < totalCount };
    } catch (error) {
        console.log("Error: ", error);
    }
}

async function SemanticSearch(req, res) {
    try {
        let {
            query,
            count = 10,
            page = 1,
        } = req.query;
        const decodedQuery = decodeURIComponent(query);
        let { userId, filters } = req.body;

        if (!decodedQuery || decodedQuery.split(" ").length < 5) {
            return res.status(400).json({
                status: false,
                message: "Error: " + "Query length is too small",
            });
        }

        filters = filters || {};

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

        const embedding = await getEmbedding(decodedQuery);

        const documents = await findSimilarDocuments(
            embedding,
            count,
            page,
            skip,
            filters,
        );
        if (userId != null) saveSearch(userId, 1, query);
        res.status(200).json({ status: true, ...documents });
    } catch (err) {
        console.error(err);
        res.json({
            message: "Error: " + err.message,
        });
    }
}
module.exports = SemanticSearch;
