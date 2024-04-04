const Movie = require("../../models/movieModel");

const getMoviesbypage = async (req, res) => {
    try {
        const page = parseInt(req.params.page);
        const limit = 12; // Adjust the limit as needed

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const movies = await Movie.find().skip(startIndex).limit(limit);
        const totalMovies = await Movie.countDocuments();

        const pagination = {};

        if (endIndex < totalMovies) {
            pagination.next = {
                page: page + 1,
                limit: limit
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit: limit
            };
        }

        res.json({
            page: page,
            totalMovies: totalMovies,
            movies: movies,
            pagination: pagination
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const createMovie = async (req, res) => {
    try {
        const newMovieData = {
            plot: req.body.plot,
            videoSrc: req.body.videoSrc,
            genres: req.body.genres,
            runtime: req.body.runtime,
            rated: req.body.rated,
            cast: req.body.cast,
            title: req.body.title,
            fullplot: req.body.fullplot,
            languages: req.body.languages,
            released: new Date(req.body.released),
            directors: req.body.directors,
            writers: req.body.writers,
            awards: {
                wins: req.body.awards.wins,
                nominations: req.body.awards.nominations,
                text: req.body.awards.text,
            },
            lastupdated: new Date(req.body.lastupdated),
            year: req.body.year,
            imdb: {
                rating: req.body.imdb.rating,
                votes: req.body.imdb.votes,
                id: req.body.imdb.id,
            },
            countries: req.body.countries,
            type: req.body.type,
            num_mflix_comments: req.body.num_mflix_comments,
            tomatoes: {
                viewer: {
                    rating: req.body.tomatoes.viewer.rating,
                    numReviews: req.body.tomatoes.viewer.numReviews,
                    meter: req.body.tomatoes.viewer.meter,
                },
                rotten: req.body.tomatoes.rotten,
                fresh: req.body.tomatoes.fresh,
                dvd: req.body.tomatoes.dvd,
                lastupdated: new Date(req.body.tomatoes.lastupdated),
            },
            poster: req.body.poster,
        };

        if (req.body.tomatoes.critic) {
            newMovieData.tomatoes.critic = {
                rating: req.body.tomatoes.critic.rating,
                numReviews: req.body.tomatoes.critic.numReviews,
                meter: req.body.tomatoes.critic.meter,
            };
        }

        const newMovie = new Movie(newMovieData);
        const savedMovie = await newMovie.save();
        res.json(savedMovie);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const updateMovie = async (req, res) => {
    try {
        const updateFields = {
            plot: req.body.plot,
            videoSrc: req.body.videoSrc,
            genres: req.body.genres,
            runtime: req.body.runtime,
            rated: req.body.rated,
            cast: req.body.cast,
            title: req.body.title,
            fullplot: req.body.fullplot,
            languages: req.body.languages,
            released: req.body.released,
            directors: req.body.directors,
            writers: req.body.writers,
            awards: {
                wins: req.body.awards.wins,
                nominations: req.body.awards.nominations,
                text: req.body.awards.text,
            },
            lastupdated: req.body.lastupdated,
            year: req.body.year,
            imdb: {
                rating: req.body.imdb.rating,
                votes: req.body.imdb.votes,
                id: req.body.imdb.id,
            },
            countries: req.body.countries,
            type: req.body.type,
            num_mflix_comments: req.body.num_mflix_comments,
            tomatoes: {
                viewer: {
                    rating: req.body.tomatoes.viewer.rating,
                    numReviews: req.body.tomatoes.viewer.numReviews,
                    meter: req.body.tomatoes.viewer.meter,
                },
                rotten: req.body.tomatoes.rotten,
                fresh: req.body.tomatoes.fresh,
                dvd: req.body.tomatoes.dvd,
                lastupdated: req.body.tomatoes.lastupdated,
            },
            poster: req.body.poster,
        };

        if (req.body.tomatoes.critic) {
            updateFields.tomatoes.critic = {
                rating: req.body.tomatoes.critic.rating,
                numReviews: req.body.tomatoes.critic.numReviews,
                meter: req.body.tomatoes.critic.meter,
            };
        }

        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { new: true }
        );

        res.json(updatedMovie);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const deleteMovie = async (req, res) => {
    try {
        await Movie.deleteOne({ _id: req.params.id });
        res.json({ message: "Movie Deleted" });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = {
    getMoviesbypage,
    createMovie,
    updateMovie,
    deleteMovie
};

