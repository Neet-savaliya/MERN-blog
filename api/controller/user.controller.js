const User = require("../models/user.model.js")

exports.getTestRout = (req, res, next) => {
    res.json({ message: "This is test message" });
};