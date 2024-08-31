const User = require("../models/user.model.js");
const customError = require("../utils/customError.js");
const bcrypt = require("bcryptjs");

exports.getTestRout = (req, res, next) => {
    res.json({ message: "This is test message" });
};

exports.putUpdate = (req, res, next) => {
    const { userId } = req.params;
    const { username, password, email, profilePicture } = req.body;

    if (password) {
        if (password.length < 6) {
            next(customError(400, "Password must be at least 6 char long"));
        }

        password = bcrypt.hashSync(password, 10);
    }

    if (username) {
        if (username.length < 7 || username.length > 20) {
            return next(customError(400, "Username must be 7 to 20 char long"));
        }
        if (username.includes(" ")) {
            return next(customError(400, "Space not allowed in username"));
        }
        if (username !== username.toLowerCase()) {
            return next(customError(400, "Uppercase not allowed in username"));
        }
        if (!username.match(/^[a-zA-Z0-9]+$/)) {
            return next(customError(400, "Special character not allowed"));
        }
    }

    User.findByIdAndUpdate(
        userId,
        {
            $set: {
                username,
                email,
                profilePicture,
                password,
            },
        },
        { new: true }
    )
        .then((user) => {
            const { password, ...rest } = user._doc;
            return res.status(200).json(rest);
        })
        .catch((err) => next(err));
};

exports.deleteAccount = async (req, res, next) => {
    const { userId } = req.params;
    try {
        await User.findByIdAndDelete(userId);
        res.status(200).json("User deleted Successfully");
    } catch (error) {
        next(error);
    }
};

exports.postSignOut = (req, res, next) => {
    try {
        res.status(200)
            .clearCookie("access_token")
            .json("User sign out successful");
    } catch (error) {
        next(error);
    }
};

exports.getUsers = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const sortDirection = req.query.sort === "ace" ? 1 : -1;
        const limit = parseInt(req.query.limit) || 9;

        const users = await User.find()
            .skip(startIndex)
            .limit(limit)
            .sort({ createdAt: sortDirection });

        const userWithoutPassword = users.map((user) => {
            const { password, ...rest } = user._doc;
            return rest;
        });

        const totalUsers = await User.countDocuments();

        const now = new Date();

        const lastMonth = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthUsers = await User.countDocuments({
            createdAt: { $gt: lastMonth },
        });

        res.status(200).json({
            users: userWithoutPassword,
            totalUsers,
            lastMonthUsers,
        });
    } catch (error) {
        next(error);
    }
};

exports.getUser = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId);
        console.log(user);
        const { password, ...rest } = user._doc;
        if (user) {
            res.status(200).json(rest);
        } else {
            customError(404, " User Not Found");
        }
    } catch (error) {
        next(error);
    }
};
