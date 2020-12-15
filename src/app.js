var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyparser = require("body-parser");
const db = require("./models/db");
const fileUpload = require('express-fileupload');
const jwtService = require("./services/jwtService");

var indexRouter = require("./api/index");
const hotelRouter = require("./api/hotel");
const userRouter = require("./api/user");
const adminRouter = require("./api/admin");
const transactionRouter = require("./api/transaction");

var app = express();

db()
  .then(() => console.log("Koneksi database telah sukses"))
  .catch((err) => `Error koneksi database ${err.message}`);

app.use(logger("dev"));
// app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve(process.cwd(), "public")));

//app.use("/", indexRouter);
app.use("/hotel", hotelRouter);
app.use("/", userRouter);
app.use("/admin", jwtService.authenticateTokenAdmin, adminRouter);
app.use("/transaction", transactionRouter);

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
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

module.exports = app;
