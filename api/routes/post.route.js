const { Router } = require("express");
const postCtr = require("../controller/post.controller")
const Route = Router();

Route.post("/create-post",postCtr.postPostSubmit);

module.exports = Route
