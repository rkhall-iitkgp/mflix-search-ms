const { User } = require("../../models");
const arr = ["fuzzysearch", "semanticsearch"];

async function deleteSearch(req, res) {
    const { search, user } = req.body;
    try {
        let newdoc = await User.findOneAndUpdate(
            { _id: user },
            { $pull: { searchHistory: { query: search } } },
            { new: true },
        );
        res.json(newdoc.searchHistory);
    } catch (error) {
        console.log("Error: ", error);
        res.json(error);
    }
}

async function getSearchHistory(req, res) {
    try {
        const userId = req.query.userId;
        const result1 = await User.findOne({ _id: userId });
        const result = result1.searchHistory;
        res.json(result);
    } catch (error) {
        console.log("Error: ", error);
        res.json(error);
    }
}

async function saveSearch(user, type, search) {
    try {
        const doc = await User.findOne({ _id: user });
        const result = doc.searchHistory;
        result.push({
            name: arr[type],
            query: search,
        });
        let newdoc = await User.findOneAndUpdate(
            { _id: user },
            { searchHistory: result },
        );
        return newdoc.searchHistory;
    } catch (error) {
        console.log("Error: ", error);
        return error;
    }
}

module.exports = { deleteSearch, getSearchHistory, saveSearch };
