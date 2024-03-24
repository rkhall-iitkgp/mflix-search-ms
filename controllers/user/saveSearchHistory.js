const { User } = require("../../models");
const arr=["fuzzysearch","semanticsearch"]
async function saveSearch(user,type, search) {
  try {
    console.log("user: ",user)
    const doc= await User.findOne({_id:user});
    console.log("doc: ",doc)
    const result=doc.searchHistory
    result.push({
        "name": arr[type],
        "query":search
    })
    let newdoc = await User.findOneAndUpdate({_id:user}, {searchHistory:result});
    console.log(newdoc.searchHistory)
    return newdoc.searchHistory
  } catch (error) {
    console.log("Error: ", error);
    return error
  }
}

module.exports = saveSearch;