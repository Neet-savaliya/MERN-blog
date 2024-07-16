const jwt = require("jsonwebtoken")
const customError = require("./customError");

module.exports.tokenVerify = (req, res, next) => {
    const token = req.cookies.access_token;
    
    const userId = req.params.userId;

    console.log(token ,userId);

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
