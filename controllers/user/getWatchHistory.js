const { User } = require("../../models");
async function getWatchHistory(req,res) {
  try {
    const userId=req.query.userId
    const result = await User.findOne({ _id:userId }).populate('moviesWatched.movie', "_id title plot genres languages year imdb tomatoes").exec();
    res.json(result.moviesWatched)
  } catch (error) {
    console.log("Error: ", error);
    res.json(error)
  }
}

module.exports = getWatchHistory;