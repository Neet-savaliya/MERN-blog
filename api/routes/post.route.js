const { Router } = require("express");
const postCtr = require("../controller/post.controller")
const Route = Router();

Route.post("/create-post",postCtr.postPostSubmit);

Route.get("/posts",postCtr.getPosts)

Route.delete("/delete-post/:postId",postCtr.deletePost)

module.exports = Route
