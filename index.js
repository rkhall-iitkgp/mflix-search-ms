const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const session = require("express-session");
const app = express();

require("./database")();

const cors = require("cors");
// Express session
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
const PORT = process.env.PORT || 5000;

const { authRouter, searchRouter } = require("./routes");

app.get("/", (req, res) => {
  res.send("Server is up and runnning");
});

app.use("/auth", authRouter);
app.use("/search", searchRouter);

app.listen(PORT, () => {
  console.log(`Server running at PORT: ${PORT}`);
});
