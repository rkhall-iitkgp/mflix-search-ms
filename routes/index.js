const searchRouter = require("./searchRoutes");
const authRouter = require("./authRoutes");
const chatbotRouter = require("./chatbotRoutes");
const adminRouter = require("./adminRoutes");
// module.exports = { searchRouter, authRouter };
const movieRouter = require("./movieRoutes");
const userRouter = require("./userRoutes");

module.exports = {
  searchRouter,
  authRouter,
  chatbotRouter,
  adminRouter,
  movieRouter,
  userRouter,
};
