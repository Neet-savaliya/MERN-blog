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

exports.getPostComments = async (req, res, next) => {
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

exports.editComment = async (req, res, next) => {
    const { commentId, userId } = req.params;
    const { content, isAdmin } = req.body;
console.log("content",content);
console.log("isAdmin",isAdmin);
console.log("commentId",commentId);
console.log("userId",userId);
    try {
        const  comment = await Comment.findById(commentId);
        console.log("found comment",comment);
        if (!comment) {
            return next(customError(404, "Comment Unavailable."));
        }
        if (comment.userId === userId || isAdmin) {
            const updatedComment = await Comment.findByIdAndUpdate(commentId, content,{new : true});
            console.log(updatedComment);
            res.status(201).json(updatedComment)
        }else{
            return next(customError(501,"Bad Request!!!"))
        }
    } catch (error) {
        next(error);
    }
};

exports.deleteComment = async(req, res, next) => {
    const {commentId, userId} = req.params;
    const {isAdmin} = req.body
    
    try {
        const comment = await Comment.findById(commentId)
        console.log("comment in delete comment :",comment);
        if(!comment.userId === userId && !isAdmin){
            return next(customError("401","unauthorized access!!"))
        }
        const response =await Comment.findByIdAndDelete(commentId)
        console.log("response of delete Comment :",response);
        if(response){
            res.status(200).json(response)
        }
    } catch (error) {
        next(error)
    }
}

exports.getComment = async(req, res, next) => {
    try {
        const limit = req.query.limit || 9;
        const sortDir = req.query.sortdirection === "acs" ? 1 : -1;
        const startIndex = req.query.skip || 0;
        
        const comment = await Comment.find().skip(startIndex).limit(limit).sort({ updatedAt: sortDir })
        console.log(comment);
        res.status(200).json(comment)
    } catch (error) {
        next(error)
    }
    
}
