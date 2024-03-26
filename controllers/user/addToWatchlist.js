const { User } = require("../../models");
async function addToWatchlist(req,res) {
  try {
    const {movie,userId}=req.body
    const movie_id=movie;
    const doc= await User.findOne({_id:userId});
    const result=doc.watchList
    result.push({"movie":movie_id})
    let newdoc = await User.findOneAndUpdate({_id:userId}, {watchList:result});
    res.json(newdoc.watchList)
  } catch (error) {
    console.log("Error: ", error);
    res.json(error)
  }
}

module.exports = addToWatchlist;