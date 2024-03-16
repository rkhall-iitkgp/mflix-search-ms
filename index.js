const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

const cors = require("cors");

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  })
);

app.use(express.json());
const PORT = process.env.PORT || 5000;

const { authRouter, searchRouter } = require("./routes");
const { logger } = require("./middlewares");

app.get("/", (req, res) => {
  res.send("Server is up and runnning");
});

app.use("/auth", logger, authRouter);
app.use("/search", searchRouter);

app.listen(PORT, () => {
  console.log(`Server running at PORT: ${PORT}`);
});
