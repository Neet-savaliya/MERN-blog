const bcrypt = require("bcryptjs");
const User = require("../models/user.model.js");

exports.postSignup = (req, res, next) => {
    console.log("called");
    const { username, email, password } = req.query;

    const saltedPassword = bcrypt
        .hash(password, 12)
        .then((password) => {
            const user = new User({
                username,
                email,
                password: password
            });

            return user.save();
        })
        .then((result) => {
            console.log(result ? "Saved successful" : "");
            res.json({ result: result });
        })
        .catch((err) => console.log(err));
};
