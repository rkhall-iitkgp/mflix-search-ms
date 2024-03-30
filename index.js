const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const session = require("express-session");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const morgan = require("morgan");

const PORT = process.env.PORT || 5000;

require("./database")();
const { connectMlModel } = require("./ml_model");
connectMlModel();
const cors = require("cors");
app.use(morgan("tiny"));

app.use(
    session({
        secret: process.env.REFRESH_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: true, 
            sameSite: 'none'
        }
    }),
);

app.use(
    cors({
        origin: ["http://localhost:3000", "http://127.0.0.1:3000", "https://mflix-platform.vercel.app"], 
        credentials: true,
    }),
);


// Redis Server connection
const { client } = require("./redis");
try {
    client.connect();
    client.on("error", (err) => console.log("Redis client error: ", err));
    client.on("connect", () => console.log("Connected to redis"));
} catch (e) {
    console.log(e);
}


app.use((req, res, next) => {
    if (req.originalUrl === "/payment/stripe/webhook") {
        next();
    } else {
        express.json()(req, res, next);
    }
});

const {
    authRouter,
    searchRouter,
    chatbotRouter,
    adminRouter,
    movieRouter,
    paymentRouter,
    userRouter,
} = require("./routes");
const { populateTiers } = require("./utils");

app.get("/", (req, res) => {
    res.send("Server is up and runnning");
});

app.use("/auth", authRouter);
app.use("/search", searchRouter);
app.use("/admin", adminRouter);
app.use("/chatbot", chatbotRouter);
app.use("/admin", adminRouter);
app.use("/movies", movieRouter);
app.use("/payment", paymentRouter);
app.use("/user", userRouter);

process.env.DEPLOYMENT == "local" &&
    app.get("/tier/populate", (req, res) => res.json(populateTiers()));

app.listen(PORT, () => {
    console.log(`Server running at PORT: ${PORT}`);
});
