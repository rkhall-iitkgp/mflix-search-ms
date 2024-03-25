const { User } = require("../../models");
const arr=["fuzzysearch","semanticsearch"]
async function saveSearch(user,type, search) {
  try {
    const doc= await User.findOne({_id:user});
    const result=doc.searchHistory
    result.push({
        "name": arr[type],
        "query":search
    })
    let newdoc = await User.findOneAndUpdate({_id:user}, {searchHistory:result});
    return newdoc.searchHistory
  } catch (error) {
    console.log("Error: ", error);
    return error
  }
}

module.exports = saveSearch;