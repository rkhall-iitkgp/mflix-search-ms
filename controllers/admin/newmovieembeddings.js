const { Movie } = require("../../models");
const {getEmbedding} =require('../../ml_model')

async function newMovieEmbed(req,res) {
    try {
        const content = req.body.message;
        // console.log(req)
        // console.log("query: ",query)
        const embedding = await getEmbedding(content);
        // const documents = await findSimilarDocuments(embedding);
        // console.log(documents);
        res.json(embedding)
    } catch (err) {
        console.error(err);
         res.json({
          message: "Error: " + err.message,
        });
    }
}
module.exports =newMovieEmbed