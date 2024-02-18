const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const campaignRouter = require("./routes/campaign");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api", campaignRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

dotenv.config();

const username = process.env.USER_NAME;
const password = process.env.PASSWORD;
const cluster = process.env.CLUSTER;
const database = process.env.DB;
const MONGO_URL = `mongodb+srv://${username}:${password}@${cluster}/${database}`;

mongoose
    .connect(MONGO_URL, {
        retryWrites: true,
        w: "majority",
    })
    .then((resp) => {
        console.log(resp);
        console.log("SUCCESS CONNECTION");
    })
    .catch((err) => console.log(err));
module.exports = app;
