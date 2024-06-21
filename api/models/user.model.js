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
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

