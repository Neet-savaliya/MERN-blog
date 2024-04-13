const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb+srv://node_complete:2801@cluster0.5zm0eog.mongodb.net/mern-blog")

app.use(bodyParser.urlencoded({ extended: false }));

app.listen(3000, () => {
    console.log("running on 3000");
});
