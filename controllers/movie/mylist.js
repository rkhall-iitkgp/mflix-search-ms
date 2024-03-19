const { Movie, User } = require("../../models");

async function MyList(req, res) {
    try {
        const user = await User.find();

        const movieIds = user.watchList.map(movie => movie.toString());

        // Fetch the movies corresponding to the movie ObjectIds
        const movies = await Movie.find({ _id: { $in: movieIds } });

        // Send the list of movies in the user's watch list as the response
        res.json(movies);

    }
    catch (error) {
        console.log("Error: ", error);
        res.status(500).json({
            message: "Error: " + error.message,
        });
    }
}

module.exports = MyList;
