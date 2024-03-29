const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Successfully connected to MongoDB");
    } catch (err) {
        console.log(err.message);
    }
};
module.exports = connectDB;
