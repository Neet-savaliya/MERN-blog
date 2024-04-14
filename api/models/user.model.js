const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name: {
            require: true,
            unique: true,
            type: String,
        },
        email: {
            require: true,
            unique: true,
            type: String,
        },
        password: {
            type: String,
            require: true,
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
