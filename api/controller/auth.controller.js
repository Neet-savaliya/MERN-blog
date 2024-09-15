const bcrypt = require("bcryptjs");
const errorHandler = require("../utils/customError.js");
const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");

exports.postSignup = (req, res, next) => {
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
            res.json({ result: result });
        })
        .catch((err) => {
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
                        { id: user._id, admin: user.admin },
                        process.env.JWT_SECRET
                    );
                    const { password: pass, ...rest } = user._doc;
                    req.cookie.access_token = token;
                    return res
                        .status(200)
                        .cookie("access_token", token, {
                            httpOnly: true,
                            sameSite: "None",
                        })
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
                const token = jwt.sign(
                    { id: user._id, admin: user.admin },
                    process.env.JWT_SECRET
                );
                const { password: pass, ...rest } = user._doc;
                // window.localStorage.setItem("access_token", token);
                req.cookies.access_token = token;
                console.log(req.cookies.access_token);
                // console.log("error");
                return res
                    .status(200)
                    .cookie("access_token", token, {
                        httpOnly: true
                    })
                    .json(rest);
            } else {
                const randomPass =
                    Math.random().toString(36).slice(-8) +
                    Math.random().toString(36).slice(-8);
                return bcrypt
                    .hash(randomPass, 2)
                    .then((saltedPass) => {
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
                        if (user) {
                            const token = jwt.sign(
                                { id: user._id, admin: user.admin },
                                process.env.JWT_SECRET
                            );
                            const { password: pass, ...rest } = user._doc;
                            // window.localStorage.setItem("access_token", token);
                            console.log("Running send another head");
                            // res.cookie.access_token = token;
                            return res
                                .status(200)
                                .cookie("access_token", token, {
                                    httpOnly: true,
                                    sameSite: "None",
                                })
                                .json(rest);
                        }
                    })
                    .catch((error) => next(error));
            }
        })

        .catch((err) => next(err));
};
