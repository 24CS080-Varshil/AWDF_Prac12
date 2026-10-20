
require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 3000;
const MONGODB_URI =
    process.env.MONGODB_URI ||
    "mongodb://127.0.0.1:27017/taskmanager";

async function startServer() {
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error(
                "JWT_SECRET is required. Add it to your .env file."
            );
        }

        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(
            "Unable to connect to MongoDB:",
            error.message
        );
        process.exitCode = 1;
    }
}

if (require.main === module) {
    startServer();
}
