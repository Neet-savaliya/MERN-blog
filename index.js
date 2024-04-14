const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const userRoutes = require("./api/routes/user.route")

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/user",userRoutes);

mongoose
    .connect(process.env.DATABASE_CONNECTION)
    .then((result) => {
        app.listen(3000, () => {
            console.log("running on 3000");
        });
    })
    .catch((err) => console.log(err));
