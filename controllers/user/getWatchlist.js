const { User } = require("../../models");
async function getWatchlist(req,res) {
    try {
        const userId=req.query.userId
        console.log("userId: ",userId)
        const result = await User.findOne({ _id:userId }).populate('watchList.movie', "_id title plot genres languages year imdb tomatoes").exec();
        res.json(result.watchList)
      } catch (error) {
        console.log("Error: ", error);
        res.json(error)
      }
}

module.exports = getWatchlist;