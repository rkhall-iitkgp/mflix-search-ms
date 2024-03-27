const express = require("express");
const router = express.Router();
const { createUser, deleteUser } = require("../controllers/user");
const { auth } = require("../middlewares");
const {
    CreateFilter,
    DeleteFilter,
    GetFilter,
    deleteFromFavourites,
    deleteSearchHistory,
    deleteFromWatchlist,
    addToWatchlist,
    saveSearch,
    saveWatchHistory,
    addToFavourites,
    getWatchHistory,
    getFavourites,
    getWatchlist,
    getSearchHistory,
} = require("../controllers/user");
router.get("/", (req, res) => {
    res.send("hello");
});
router.get("/filter", GetFilter);
router.post("/filter", CreateFilter);
router.delete("/filter", DeleteFilter);
router.post("/create", auth, createUser);
router.delete("/delete", auth, deleteUser);
router.post("/watchlist", addToWatchlist);
router.delete("/watchlist", deleteFromWatchlist);
router.get("/watchlist", getWatchlist);
router.post("/search", saveSearch);
router.get("/search", getSearchHistory);
router.delete("/search", deleteSearchHistory);
router.post("/favourites", addToFavourites);
router.get("/favourites", getFavourites);
router.delete("/favourites", deleteFromFavourites);
router.post("/history", saveWatchHistory);
router.get("/history", getWatchHistory);
module.exports = router;
