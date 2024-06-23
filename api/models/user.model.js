const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username: {
            required: true,
            type: String,
            unique:true
        },
        email: {
            required: true,
            type: String,
            unique:true
        },
        password: {
            type: String,
            required: true,
        },
        profilePicture : {
            type : String,
            default : "https://media.istockphoto.com/id/610003972/vector/vector-businessman-black-silhouette-isolated.jpg?s=612x612&w=0&k=20&c=Iu6j0zFZBkswfq8VLVW8XmTLLxTLM63bfvI6uXdkacM="
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

