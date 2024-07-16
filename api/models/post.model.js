const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default:
                "https://venngage-wordpress.s3.amazonaws.com/uploads/2020/10/Anatomy-of-the-Perfect-Blog-Post.png",
        },
        category: {
            type: String,
            default: "Uncategorized",
        },
        slug: {
            type: String,
            require: true,
            unique: true,
        },
    },
    { timestamps: true }
);

const Post = mongoose.model("Posts", postSchema);

module.exports =  Post;
