const { User } = require("../../models");
async function getSearchHistory(req,res) {
  try {
    const userId=req.query.userId
    console.log("userId: ",userId)
    const result1 = await User.findOne({ _id:userId })
    const result = result1.searchHistory;
    console.log("Search History: ",result)
    res.json(result)
  } catch (error) {
    console.log("Error: ", error);
    res.json(error)
  }
}

module.exports = getSearchHistory;