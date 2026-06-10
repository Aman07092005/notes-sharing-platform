const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

exports.register = async (req, res) => {
try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    // Password validation
    const passwordRegex =
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-\\[\]\/])[A-Za-z\d!@#$%^&*(),.?":{}|<>_\-\\[\]\/]{8,}$/;

    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message:
                "Password must be at least 8 characters long, include 1 uppercase letter, 1 number, and 1 special character"
        });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(400).json({
            message: "Email already registered"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const avatar = `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${username}`;

    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        avatar
    });

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });

} catch (error) {
    res.status(500).json({
        message: error.message
    });
}
};

exports.login = async (req, res) => {
try {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const isMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!isMatch) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        message: "Login successful",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar
        }
    });

} catch (error) {
    res.status(500).json({
        message: error.message
    });
}
};

exports.logout = (req, res) => {
    res.clearCookie("token");

    res.status(200).json({
        message: "Logout successful"
    });
};