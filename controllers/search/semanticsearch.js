const { Movie } = require("../../models");
const { getEmbedding } = require('../../ml_model')

async function findSimilarDocuments(embedding, filters) {
    try {
        const queryVector = Array.from(embedding.data);
        const agg = [
            {
                "$vectorSearch": {
                    "queryVector": queryVector,
                    "path": "plot_embedding",
                    "numCandidates": 1000,
                    "limit": 25,
                    "index": "semantic_search",
                    "filter": {
                        '$and': [
                            {
                                "year": { $in: [filters.year] }
                            },
                            {
                                'imdb.rating': {
                                    '$gt': parseFloat(filters.rating.low)
                                },
                                'imdb.rating': {
                                    '$lt': parseFloat(filters.rating.high)
                                }
                            },
                            {
                                'languages': { $in: [filters.languages] }// Filter by genres
                            },
                            {
                                'countries': { $in: [filters.countries] }
                            },
                            {
                                'genres': { $in: [filters.genres] }
                            },
                            {
                                'type': { $in: [filters.type] }
                            }
                        ]
                    }
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "plot": 1,
                    "title": 1,
                    "score": { "$meta": "vectorSearchScore" }
                }
            }
        ]
        const documents = await Movie.aggregate(agg);

        return documents;
    } catch (error) {
        console.log("Error: ", error);
    }
}

async function SemanticSearch(req, res) {
    try {
        const { query } = req.query;
        const { filters } = req.body;
        //console.log(filters)
        const embedding = await getEmbedding(query);
        const documents = await findSimilarDocuments(embedding, filters);
        console.log(documents);
        res.json(documents)
    } catch (err) {
        console.error(err);
        res.json({
            message: "Error: " + err.message,
        });
    }
}
module.exports = SemanticSearch