const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authenticate = require("../middleware/auth");
const { validateCredentials } = require("../middleware/validation");

const router = express.Router();

const userResponse = (user) => ({
    id: user._id.toString(),
    email: user.email,
    createdAt: user.createdAt
});

router.post("/register", validateCredentials, async (req, res) => {
    const { email, password } = req.credentials;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(409).json({ message: "An account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    res.status(201).json({
        message: "Registration successful. Please log in.",
        user: userResponse(user)
    });
});

router.post("/login", validateCredentials, async (req, res) => {
    const { email, password } = req.credentials;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Email or password is incorrect" });
    }

    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, {
        expiresIn: "1h"
    });

    res.status(200).json({
        message: "Login successful",
        token,
        user: userResponse(user)
    });
});

router.get("/me", authenticate, async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(401).json({ message: "User no longer exists" });
    }

    res.status(200).json({ user: userResponse(user) });
});

module.exports = router;
