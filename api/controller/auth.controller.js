const bcrypt = require("bcryptjs");
const errorHandler = require("../utils/customError.js");
const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const { rmSync } = require("fs");

exports.postSignup = (req, res, next) => {
    console.log(req.body);
    console.log("called");

    const { username, email, password } = req.body;

    if (
        username === "" ||
        email === "" ||
        password === "" ||
        username === undefined ||
        email === undefined ||
        password === undefined
    ) {
        next(errorHandler(400, "All field required"));
    }

    bcrypt
        .hash(password, 12)
        .then((password) => {
            const user = new User({
                username,
                email,
                password: password,
            });

            return user.save();
        })
        .then((result) => {
            console.log(result ? "Saved successful" : "");
            res.json({ result: result });
        })
        .catch((err) => {
            console.log(err);
            next(err);
        });
};

exports.postLogin = (req, res, next) => {
    const { email, password } = req.body;

    User.findOne({ email: email }).then((user) => {
        if (!user) {
            next(errorHandler(400, "user not found"));
        } else {
            bcrypt.compare(password, user.password).then((validPass) => {
                if (validPass) {
                    const token = jwt.sign(
                        { id: user._id },
                        process.env.JWT_SECRET
                    );
                    const { password: pass, ...rest } = user._doc;
                    return res
                        .status(200)
                        .cookie("access_token", token)
                        .json(rest);
                } else {
                    return next(errorHandler(400, "Password is invalid."));
                }
            });
        }
    });
};

exports.postGoogleSignup = (req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body;

    User.findOne({ email: email })
        .then((user) => {
            if (user) {
                console.log("running 1");
                const token = jwt.sign(
                    { id: user._id },
                    process.env.JWT_SECRET
                );
                const { password: pass, ...rest } = user._doc;
                return res.status(200).cookie("token", token).json(rest);
            } else {
                console.log("running 2");
                const randomPass =
                    Math.random().toString(36).slice(-8) +
                    Math.random().toString(36).slice(-8);
                return bcrypt.hash(randomPass, 2);
            }
        })
        .then((saltedPass) => {
            console.log("running 3");
            const user = new User({
                username:
                    name.toLowerCase().split(" ").join("") +
                    Math.random().toString(8).slice(-3),
                email,
                password: saltedPass,
                profilePicture: googlePhotoUrl,
            });

            return user.save();
        })
        .then((user) => {
            console.log("running 4");
            if (user) {
                console.log(user);
                const token = jwt.sign(
                    { id: user._id },
                    process.env.JWT_SECRET
                );
                console.log(user);
                const {password : pass , ...rest} = user._doc;
                return res.status(200).cookie("token", token).json(rest);
            }
        })
        .catch((err) => next(err));
};
