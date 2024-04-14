const express = require("express")
const userCtr = require("../controller/user.controller")

const Router = express.Router()

Router.get("/test" , userCtr.getTestRout)

module.exports = Router