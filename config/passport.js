require("dotenv").config();

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const FacebookStrategy = require("passport-facebook").Strategy;
const findOrCreate = require("mongoose-findorcreate");
//const GoogleStrategy = require("passport-google-auth20").Strategy;
var mongoose = require('mongoose');



// Load User Model
const User = require('../models/User');


module.exports = function(passport)
{

    passport.use(
        new LocalStrategy({ usernameField:'email'} , (email,password,done) => {
            // match user
            User.findOne({ email: email})
                .then (user => {
                    if(!user)
                    {
                        return done (null,false,{ message: 'That email is not registered'});
                    }

                    // match passwords
                    bcrypt.compare(password,user.password,(err, isMatch) => {
                        if(err) throw err;

                        if(isMatch) {
                            return done(null,user);

                        }
                        else
                        {
                            return done(null,false,{message:'Password is incorrect'});
                        }
                    })

                })
                .catch(err => console.log(err));
        })
    );




    // Facebook 
    passport.use(new FacebookStrategy({
        clientID: process.env.CLIENT_ID_FB,
        clientSecret: process.env.CLIENT_SECRET_FB,
        callbackURL: "http://localhost:3000/users/facebook/callback",
        profileFields: ['id','displayName','name','email','picture.type(large)']
      },
      function(accessToken, refreshToken, profile, done) {
        // asynchronous
        process.nextTick(function() {
            console.log("faceboook id",profile.name);
            // find the user in the database based on their facebook id
            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                console.log("we are in the findone");
    
                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err) {
                    
                    console.log("error here")
                    return done(err);
                }
                // if the user is found, then log them in
                if (user) {
                    console.log("user found")
                    console.log(user)
                    return done(null, user); // user found, return that user
                } else {
                    console.log("user not found");
                    // if there is no user found with that facebook id, create them
                    var newUser = new User();
    
                    // set all of the facebook information in our user model
                    newUser._id    = profile.id; // set the users facebook id                   
                    //newUser.token = token; // we will save the token that facebook provides to the user                    
                    newUser.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                    newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                    //newUser.gender = profile.gender
                    console.log("picture:", profile.photos[0].value);

                    newUser.avatar = profile.photos[0].value;

                    // save our user to the database
                    newUser
                            .save()
                            .then(user => {
                                console.log(newUser);
                                res.redirect('/users/login')})
                            .catch(err => console.log(err))
                }
    
            });
    
        })
    
    }));


    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user);
        });
    });
}


