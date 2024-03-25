const { User } = require("../../models");
async function getFavourites(req,res) {
    try {
        const userId=req.query.userId
        const result = await User.findOne({ _id:userId }).populate('favoriteMovies.movie', "_id title plot genres languages year imdb tomatoes").exec();
        res.json(result.favoriteMovies)
      } catch (error) {
        console.log("Error: ", error);
        res.json(error)
      }
}

module.exports = getFavourites;