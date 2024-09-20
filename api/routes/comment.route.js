const express = require("express");
const commentCtr = require("../controller/comment.controller");

const router = express.Router();

router.post("/create", commentCtr.createComment);

router.get("/getPostComment/:postId", commentCtr.getComments);

router.put("/like/:commentId/:userId", commentCtr.likeComment);

router.post("/edit/:commentId/:userId", commentCtr.editComment);

router.delete("/delete/:commentId/:userId",commentCtr.deleteComment)

module.exports = router;
