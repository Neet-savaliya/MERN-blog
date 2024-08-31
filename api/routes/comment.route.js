const express = require("express");
const commentCtr = require("../controller/comment.controller");

const router = express.Router();

router.post("/create", commentCtr.createComment);
router.get("/getPostComment/:postId",commentCtr.getComments )

module.exports =  router;
