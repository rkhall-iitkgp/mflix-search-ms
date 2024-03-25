const express = require("express");
const router = express.Router();
const { createUser, deleteUser } = require("../controllers/user");
const { auth } = require("../middlewares");
const {InitialFilter, CreateFilter, DeleteFilter, GetFilter,deleteFromFavourites,deleteSearchHistory,deleteFromWatchlist,addToWatchlist,saveSearch,saveWatchHistory,addToFavourites ,getWatchHistory,getFavourites,getWatchlist,getSearchHistory} = require("../controllers/user");
router.get("/", (req, res) => {
  res.send("hello");
});
router.get("/filter", InitialFilter);
router.post("/createfilter", CreateFilter);
router.delete("/deletefilter", DeleteFilter);
router.get("/getfilter", GetFilter);
router.post("/create", auth, createUser);
router.delete("/delete", auth, deleteUser);
router.post("/addToWatchlist",addToWatchlist);
router.post("/saveSearchHistory",saveSearch);
router.post("/saveWatchHistory",saveWatchHistory);
router.post("/addToFavourites",addToFavourites);
router.get("/getWatchHistory",getWatchHistory);
router.get("/getFavourites",getFavourites);
router.get("/getWatchlist",getWatchlist);
router.get("/getSearch",getSearchHistory);
router.delete("/deleteFavourites",deleteFromFavourites)
router.delete("/deleteSearch",deleteSearchHistory)
router.delete("/deleteWatchlist",deleteFromWatchlist)
module.exports = router;
