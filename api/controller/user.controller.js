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
