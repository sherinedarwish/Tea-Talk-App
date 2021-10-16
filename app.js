require("dotenv").config();
//const redisClient = require('./helpers/init_redis');
var createError = require('http-errors');
const express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const passport= require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const methodOverride = require("method-override");
//const redisStore = require('connect-redis')(session);   
var cloudinary = require('cloudinary').v2;
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(express.json());

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("layout", "./layout");

//Passport config
require("./config/passport")(passport);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Body Parser
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


// Express session
app.use(
  session({
      secret: "secret",
      resave: true,
      saveUninitialized: true,
  })
);

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

// App Router
app.use('/', indexRouter);
app.use('/users', usersRouter);



module.exports = app;


const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server running on ${PORT}`));
