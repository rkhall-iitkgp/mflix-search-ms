const searchRouter = require("./searchRoutes");
const authRouter = require("./authRoutes");

const chatbotRouter = require("./chatbotRoutes");
const adminRouter=require("./adminRoutes")
// module.exports = { searchRouter, authRouter };
const movieRouter= require("./movieRoutes")

module.exports = { searchRouter, authRouter,chatbotRouter,adminRouter, movieRouter };
