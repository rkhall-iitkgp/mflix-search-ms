const { Movie } = require("../../models");
const { getEmbedding } = require("../../ml_model");

async function findSimilarDocuments(embedding, count, page, skip) {
    try {
        const queryVector = Array.from(embedding.data);
        const agg = [
            {
                $vectorSearch: {
                    queryVector: queryVector,
                    path: "plot_embedding",
                    numCandidates: 1000,
                    limit: 25,
                    index: "semantic_search",
                },
            },
            {
                $project: {
                    score: { $meta: "vectorSearchScore" },
                    _id: 1,
                    title: 1,
                    plot: 1,
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
        const output = (await Movie.aggregate(agg))[0];
        let results = output.results;
        const totalCount = output.totalCount[0]?.count;
        if (!totalCount || isNaN(totalCount)) return res.status(200).json({
            status: true,
            result: [],
            message: "Error: " + "No Result Found",
        });
        const currCount = page * count;

        return { results, hasNext: currCount < totalCount };
    } catch (error) {
        console.log("Error: ", error);
    }
}

async function SemanticSearch(req, res) {
    try {
        let { query, count = 10, page = 1 } = req.query;
        const decodedQuery = decodeURIComponent(query);

        if (!decodedQuery || decodedQuery.split(" ").length < 5) {
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

        const embedding = await getEmbedding(decodedQuery);
        const documents = await findSimilarDocuments(
            embedding,
            count,
            page,
            skip,
        );

        res.status(200).json({ status: true, ...documents });
    } catch (err) {
        console.error(err);
        res.json({
            message: "Error: " + err.message,
        });
    }
}
module.exports = SemanticSearch;
