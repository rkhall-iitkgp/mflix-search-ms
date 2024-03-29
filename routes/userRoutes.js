const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares");
const {
    CreateFilter,
    DeleteFilter,
    GetFilter,
    deleteFromFavourites,
    deleteSearch,
    deleteFromWatchlist,
    addToWatchlist,
    saveSearch,
    saveWatchHistory,
    addToFavourites,
    getWatchHistory,
    getFavourites,
    getWatchlist,
    getSearchHistory,
    createUser, 
    deleteUser,
    getUserDetails
} = require("../controllers/user");
router.get("/", (req, res) => {
    res.send("hello");
});
router.get("/filter/:userId", GetFilter);
router.post("/filter/:userId", CreateFilter);
router.delete("/filter/:userId", DeleteFilter);
router.post("/create", auth, createUser);
router.delete("/delete", auth, deleteUser);
router.post("/watchlist/:userId", addToWatchlist);
router.delete("/watchlist/:userId", deleteFromWatchlist);
router.get("/watchlist/:userId", getWatchlist);
router.get("/search/:userId", getSearchHistory);
router.delete("/search/:userId", deleteSearch);
router.post("/favourites/:userId", addToFavourites);
router.get("/favourites/:userId", getFavourites);
router.delete("/favourites/:userId", deleteFromFavourites);
router.post("/history/:userId", saveWatchHistory);
router.get("/history/:userId", getWatchHistory);
router.get("/details/:userId", auth,getUserDetails);
module.exports = router;
