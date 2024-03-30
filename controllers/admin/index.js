const newMovieEmbed = require('./newmovieembeddings')
const {
    getMoviesbypage,
    createMovie,
    updateMovie,
    deleteMovie
} = require('./crud')

module.exports = {
    getMoviesbypage,
    createMovie,
    updateMovie,
    deleteMovie,    
    newMovieEmbed
};

