const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRoutes = require("./routes/user.route");
const AuthRoutes = require("./routes/auth.route");
const PostRoutes = require("./routes/post.route");
const CommentRoutes = require("./routes/comment.route");
const path = require("path")
dotenv.config();

__dirname = path.resolve()

const MONGO_URL = process.env.DATABASE_CONNECTION

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Method", "POST,GET,PUT,DELETE,PATCH");
    res.setHeader("Access-Control-Allow-Header", "Content-Type,Authentication");
    next();
});

// app.use((req, res, next) => {
//     req.cookies.name = "Neet";
//     next();
// });


app.use("/api/user", userRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/post", PostRoutes);
app.use("/api/comment", CommentRoutes);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  });

app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal server error";
    res.status(statusCode).json({ success: "false", statusCode, message });
});

mongoose
    .connect(MONGO_URL)
    .then((result) => {
        app.listen(3000, () => {
            console.log("running on 3000");

        });
    })
    .catch((err) => console.log(err));
