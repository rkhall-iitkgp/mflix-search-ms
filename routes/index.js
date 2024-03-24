const searchRouter = require("./searchRoutes");
const authRouter = require("./authRoutes");
const paymentRouter = require("./paymentRoutes");
const chatbotRouter = require("./chatbotRoutes");
const adminRouter = require("./adminRoutes");
const movieRouter = require("./movieRoutes");

module.exports = {
    searchRouter,
    authRouter,
    chatbotRouter,
    adminRouter,
    movieRouter,
    paymentRouter,
};
