const express = require("express");
const authCtr = require("../controller/auth.controller")
const Router = express.Router();

Router.post("/signup", authCtr.postSignup);

module.exports = Router;
