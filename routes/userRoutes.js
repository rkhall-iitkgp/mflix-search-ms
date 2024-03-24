const express = require("express");
const { createUser, deleteUser } = require("../controllers/user");
const { auth } = require("../middlewares");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("hello");
});

router.post("/create", auth, createUser);
router.delete("/delete", auth, deleteUser);
module.exports = router;
