const express = require("express");
const authCtr = require("../controller/auth.controller")
const Router = express.Router();

Router.post("/signup", authCtr.postSignup);

Router.post("/login",authCtr.postLogin);

Router.post("/google",authCtr.postGoogleSignup)

module.exports = Router;