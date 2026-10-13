const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");

// Parse JSON
app.use(express.json());

// Permit requests from the Vite development server.
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});

// Logging Middleware
app.use(logger);

// Task Routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});


// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/taskmanager";

async function startServer() {
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is required. Add it to your .env file.");
        }

        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Unable to connect to MongoDB:", error.message);
        process.exit(1);
    }
}

startServer();
