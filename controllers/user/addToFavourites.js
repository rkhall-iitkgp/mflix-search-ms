const { User } = require("../../models");
async function addToFavourites(req,res) {
  try {
    const {movie,userId}=req.body
    const movie_id=movie._id.$oid;
    const doc= await User.findOne({_id:userId});
    const result=doc.favoriteMovies
    result.push({"movie":movie_id})
    let newdoc = await User.findOneAndUpdate({_id:userId}, {favoriteMovies:result});
    res.json(newdoc.favoriteMovies)
  } catch (error) {
    console.log("Error: ", error);
    res.json(error)
  }
}

module.exports = addToFavourites;