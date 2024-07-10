const express = require("express");
const userCtr = require("../controller/user.controller");
const {tokenVerify} = require("../utils/tokenVerify");

const Router = express.Router();

Router.get("/test", userCtr.getTestRout);

Router.put("/update/:userId", tokenVerify, userCtr.putUpdate);

module.exports = Router;
