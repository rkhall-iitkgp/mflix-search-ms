const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

require("./database")();

const cors = require("cors");

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  })
); 3

app.use((req, res, next) => {
  if (req.originalUrl === "/payment/stripe/webhook") {
    next();
  }
  else {
    express.json()(req, res, next);
  }
})

const PORT = process.env.PORT || 5000;

const { authRouter, searchRouter, paymentRouter } = require("./routes");
const { populateTiers, populateMovies } = require("./utils");

app.get("/", (req, res) => {
  res.send("Server is up and runnning");
});

app.use("/auth", authRouter);
app.use("/search", searchRouter);
app.use("/payment", paymentRouter);
app.listen(PORT, () => {
  console.log(`Server running at PORT: ${PORT}`);
});
