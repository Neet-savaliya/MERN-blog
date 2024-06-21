const bcrypt = require("bcryptjs");
const errorHandler = require("../utils/customError.js");
const User = require("../models/user.model.js");

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
        next(errorHandler(400,"All field required"));
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