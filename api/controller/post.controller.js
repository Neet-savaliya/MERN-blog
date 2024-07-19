const  Post  = require("../models/post.model");
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
        ...req.body,slug
    })

    try {
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    } catch (error) {
        next(error)
    }
};
