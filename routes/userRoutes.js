const express = require("express");
const { createUser, deleteUser } = require("../controllers/user");
const { auth } = require("../middlewares");
const router = express.Router();
const {addToWatchlist,saveSearch,saveWatchHistory,addToFavourites ,getWatchHistory,getFavourites,getWatchlist,getSearch} = require("../controllers/user");
const getSearchHistory = require("../controllers/user/getSearchHistory");

router.get("/", (req, res) => {
  res.send("hello");
});

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
module.exports = router;
