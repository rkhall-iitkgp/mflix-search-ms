const { Movie } = require("../../models");
const { getEmbedding } = require("../../ml_model");

async function newMovieEmbed(req, res) {
    try {
        const content = req.body.message;
        const plot_embedding = await getEmbedding(content[0]);
        const fullplot_embedding = await getEmbedding(content[1]);
        res.json({
            plot_embedding: plot_embedding,
            fullplot_embedding: fullplot_embedding,
        });
    } catch (err) {
        console.error(err);
        res.json({
            message: "Error: " + err.message,
        });
    }
}
module.exports = newMovieEmbed;
