require("dotenv").config();
//const redisClient = require('./helpers/init_redis');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const passport= require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const redisStore = require('connect-redis')(session);   
var cloudinary = require('cloudinary').v2;
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//Passport config
require("./config/passport")(passport);

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("layout", "./layout");

// Body Parser
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


// MongoDB
mongoose
    .connect(process.env.CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected DB"))
    .catch((err) => console.log(err));

cloudinary.config({ 
  cloud_name: 'sherine', 
  api_key: process.env.API_KEY, 
  api_secret:  process.env.API_SECRET 
});

// Express session
app.use(
  session({
      secret: "secret",
      resave: true,
      saveUninitialized: true,
  })
);


// Method Override
app.use(methodOverride("_method"));


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());


// Global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("sucess_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// App Router
app.use('/', indexRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });


const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server running on ${PORT}`));

module.exports = app;
