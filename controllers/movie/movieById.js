const { Movie } = require("../../models");

module.exports = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Movie.findById(id).select(
            "-plot_embedding -fullplot_embedding",
        );
        res.status(200).json({
            status: true,
            result,
        });
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({
            status: false,
            message: "Error: " + error.message,
        });
    }
};
