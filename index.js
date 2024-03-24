const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const session = require("express-session");
const app = express();

const PORT = process.env.PORT || 5000;

require("./database")();
const { connectMlModel } = require("./ml_model");
connectMlModel();
const cors = require("cors");
const morgan = require("morgan");

app.use(express.json());
app.use(morgan("tiny"));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    }),
);

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
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

app.use(express.json());

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
} = require("./routes");
const { populateTiers } = require("./utils");

app.get("/", (req, res) => {
    res.send("Server is up and runnning");
});

app.use("/auth", authRouter);
app.use("/search", searchRouter);
app.use("/chatbot", chatbotRouter);
app.use("/admin", adminRouter);
app.use("/movies", movieRouter);
app.use("/payment", paymentRouter);

process.env.DEPLOYMENT == "local" &&
    app.get("/tier/populate", (req, res) => res.json(populateTiers()));

app.listen(PORT, () => {
    console.log(`Server running at PORT: ${PORT}`);
});
