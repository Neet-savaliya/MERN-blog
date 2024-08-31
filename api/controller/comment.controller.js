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
        console.log(error);
    }
};
