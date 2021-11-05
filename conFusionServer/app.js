var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const Dishes = require("./models/dishes");
var config = require('./config');
const url = config.mongoUrl;
const connect = mongoose.connect(url);
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var dishRouter = require("./routes/dishRouter");
var promoRouter = require("./routes/promoRouter");
var leaderRouter = require("./routes/leaderRouter");
const { use } = require("./routes/index");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const passport = require("passport");
const authenticate = require("./authenticate");
const uploadRouter = require("./routes/uploadRouter")
var app = express();

connect.then(
  (db) => {
    console.log("Connected correctly to server");
  },
  (err) => {
    console.log(err);
  }
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  }
  else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
});

app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);

app.use(express.static(path.join(__dirname, "public")));
app.use("/users", usersRouter);
app.use("/dishes", dishRouter);
app.use("/promotions", promoRouter);
app.use("/leaders", leaderRouter);
app.use("/imageUpload", uploadRouter)

// view engine setup


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

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

module.exports = app;
