const createUser = require("./createUser");
const deleteUser = require("./deleteUser");
const {
    addToFavourites,
    getFavourites,
    deleteFromFavourites,
} = require("./favourite");
const { CreateFilter, DeleteFilter, GetFilter } = require("./filter");
const {
    addToWatchlist,
    deleteFromWatchlist,
    getWatchlist,
} = require("./watchlist");
const {
    saveSearch,
    getSearchHistory,
    deleteSearch,
} = require("./searchHistory");
const { saveWatchHistory, getWatchHistory } = require("./watchHistory");

const {getUserDetails} = require('./details')

module.exports = {
    CreateFilter,
    DeleteFilter,
    GetFilter,
    deleteFromFavourites,
    deleteFromWatchlist,
    deleteSearch,
    createUser,
    deleteUser,
    addToWatchlist,
    getSearchHistory,
    saveWatchHistory,
    saveSearch,
    addToFavourites,
    getWatchHistory,
    getWatchlist,
    getFavourites,
    getUserDetails
};
