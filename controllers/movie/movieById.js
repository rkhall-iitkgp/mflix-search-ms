const { Movie } = require("../../models");

async function moviesbyid(req, res){
    try {
        const { id } = req.params;
        const result = await Movie.findById(id).select(
            "-plot_embedding -fullplot_embedding -embedding",
        );
        res.status(200).json({
            status: true,
            result,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Error: " + error.message,
        });
    }
};
module.exports=moviesbyid