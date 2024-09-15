const customError = require("../utils/customError");
const Comment = require("../models/comment.model");

exports.createComment = async (req, res, next) => {
    try {
        const { content, postId, userId } = req.body;
        // console.log(req.user);

        // if (req.user.id !== userId) {
        //     return customError(404, "user NOT found");
        // }
        const newComment = new Comment({
            content,
            postId,
            userId,
        });
        await newComment.save();

        res.status(200).json(newComment);
    } catch (error) {
        next(error);
    }
};

exports.getComments = async (req, res, next) => {
    const postId = req.params.postId;
    try {
        const comments = await Comment.find({ postId: postId });
        if (comments) {
            res.status(200).json(comments);
        }
    } catch (error) {
        next(error);
    }
};

exports.likeComment = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;
        const userId = req.params.userId;

        console.log("commentId :", commentId);
        console.log("userId :", userId);

        const comment = await Comment.findById(commentId);
        console.log("comment :", comment);
        if (!comment) {
            return next(customError(404, "Comment not found"));
        }
        const userIndex = comment.likes.indexOf(userId);
        console.log("userIndex :", userIndex);
        if (userIndex === -1) {
            comment.numberOfLikes = comment.numberOfLikes + 1;
            comment.likes.push(userId);
        } else {
            comment.numberOfLikes = comment.numberOfLikes - 1;
            comment.likes.splice(userIndex, 1);
        }
        const response = await comment.save();
        console.log("response :", response);

        res.status(200).json(comment);
    } catch (error) {
        next(error);
    }
};
