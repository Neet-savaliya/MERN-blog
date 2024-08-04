const { error } = require("console");
const Post = require("../models/post.model");
const customError = require("../utils/customError");

exports.postPostSubmit = async (req, res, next) => {
    if (!req.body.admin) {
        return next(customError(403, "Not allowed to create any post"));
    }

    if (!req.body.title || !req.body.content) {
        return next(customError(400, "Problem in content of post"));
    }

    const slug = req.body.title
        .split(" ")
        .join("-")
        .toLowerCase()
        .replace(/[^a-zA-Z0-9-]/g, "");

    const newPost = new Post({
        ...req.body,
        slug,
    });

    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (error) {
        next(error);
    }
};

exports.getPosts = async (req, res, next) => {
    try {
        const startIndex = req.query.startIndex || 0;
        const limit = req.query.limit || 9;
        const sortDirection = req.query.order === "asc" ? 1 : -1;
        const post = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.postId && { postId: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $option: "i" } },
                    { content: { $regex: req.query.searchTerm, $option: "i" } },
                ],
            }),
        })
            .sort({updatedAt : sortDirection})
            .skip(startIndex)
            .limit(limit);

        const totalPost = await Post.countDocuments();

        const now = new Date();

        const lastMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthPost = await Post.countDocuments({
            createdAt: { $gte: lastMonthAgo },
        });  

        res.status(200).json({post, totalPost, lastMonthPost});
    } catch (error) {
        next(error);
    }
};

exports.deletePost =async (req, res, next) => {
    const {postId} = req.params
    try {
        const data = await Post.findByIdAndDelete(postId)
        if(data){
            res.status(200).json({data :"Post deleted successfully."})
        }else{
            res.status(404).json({message:"Data not found!"})
        }
    } catch (error) {
        next(error)
    }
}
