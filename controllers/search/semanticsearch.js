const { Movie } = require("../../models");
const {getEmbedding} =require('../../ml_model')

async function findSimilarDocuments(embedding) {
    try {
        const queryVector = Array.from(embedding.data);
        const agg= [
            {
                "$vectorSearch": {
                    "queryVector": queryVector,
                    "path": "plot_embedding",
                    "numCandidates": 1000,
                    "limit": 25,
                    "index": "semantic_search",
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
    } catch(error) {
        console.log("Error: ", error);
      }
}

async function SemanticSearch(req,res) {
    try {
        const { query } = req.query;
        const embedding = await getEmbedding(query);
        const documents = await findSimilarDocuments(embedding);
        console.log(documents);
        res.json(documents)
    } catch (err) {
        console.error(err);
         res.json({
          message: "Error: " + err.message,
        });
    }
}
module.exports =SemanticSearch