const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MongoDB_URL);
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error(err.message);
        process.exit(1); // Exit process with failure
    }
}

module.exports = connectDB;
