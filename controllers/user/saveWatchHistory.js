const { User } = require("../../models");

async function saveWatchHistory(req, res) {
  
  try {
    const {movie,watchdurn,userId}=req.body
    const doc= await User.findOne({_id:userId});
    const movie_id=movie._id.$oid;
    const result=doc.moviesWatched
    result.push({
        "movie": movie_id,
        "durationWatched":watchdurn
    })
    let newdoc = await User.findOneAndUpdate({_id:userId},{moviesWatched:result});
    res.json(newdoc)
  } catch (error) {
    console.log("Error: ", error);
    res.json(error)
  }
}

module.exports = saveWatchHistory;