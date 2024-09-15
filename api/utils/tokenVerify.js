const jwt = require("jsonwebtoken");
const customError = require("./customError");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const app = express();

app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173", // Your frontend URL
        credentials: true, // Allow credentials (cookies) to be sent
    })
);

module.exports.tokenVerify = (req, res, next) => {
    // const token = req.cookies.access_token;

    console.log("Cookies:", req.cookies); // Debug line
    const token = req.cookies.access_token;
    const userId = req.params.userId;
    console.log("Token:", token, "UserID:", userId);

    // console.log(req);

    // const userId = req.params.userId;

    // console.log(token ,userId);

    // jwt.verify(token, process.env.JWT_SECRET, (err,data) => {
    //     console.log(data , userId);
    //     if (data.id === userId) {
    //         return next();
    //     } else {
    //         next(customError(401, "Unauthorized access"));
    //     }
    // });

    next();
};
