const { User } = require("../../models");
const arr=["fuzzysearch","semanticsearch"]
async function deleteSearch(req,res) {
    const {search,user}=req.body
  try {
    let newdoc = await User.findOneAndUpdate(
        { _id: user },
        { $pull: { searchHistory: { query: search } } },
        { new: true } 
    );
    res.json(newdoc.searchHistory)
  } catch (error) {
    console.log("Error: ", error);
    res.json(error)
  }
}

module.exports = deleteSearch;