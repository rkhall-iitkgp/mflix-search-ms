const { Movie } = require("../../models");

async function TrendingMovies(req, res) {
    try {
        const allMovies = await Movie.find();

        const ratedMovies = allMovies.filter(movie => movie.tomatoes.viewer.meter && movie.year);

        // Calculate weighted score for each movie
        ratedMovies.forEach(movie => {
            const tomatoesMeter = movie.tomatoes.viewer.meter;
            const releaseYear = movie.year;
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();

            // Weight for release date (earlier is better)
            const releaseWeight = 1 / (currentYear + 1 - releaseYear);
            // Calculate weighted score
            movie.weightedScore = releaseWeight * (tomatoesMeter / 100);
        });

        // Sort movies based on weighted score in descending order
        ratedMovies.sort((a, b) => b.weightedScore - a.weightedScore);

        const topTrendingMovies = ratedMovies.slice(0, 10);


        res.json(topTrendingMovies);
    }
    catch (error) {
        console.log("Error: ", error);
        res.status(500).json({
            message: "Error: " + error.message,
        });
    }
}

module.exports = TrendingMovies;
