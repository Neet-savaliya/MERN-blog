const express = require("express");
const userCtr = require("../controller/user.controller");
const { tokenVerify } = require("../utils/tokenVerify");

const Router = express.Router();

Router.get("/test", userCtr.getTestRout);

Router.put("/update/:userId", tokenVerify, userCtr.putUpdate);

Router.delete("/delete/:userId", tokenVerify, userCtr.deleteAccount);

Router.post("/sign-out",userCtr.postSignOut);

Router.get("/getUsers",userCtr.getUsers);

Router.get("/:userId",userCtr.getUser)

module.exports = Router;
