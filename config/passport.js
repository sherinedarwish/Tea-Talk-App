require("dotenv").config();

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const FacebookStrategy = require("passport-facebook").Strategy;
const findOrCreate = require("mongoose-findorcreate");



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
      function(accessToken, refreshToken, profile, cb) {
        console.log(profile);
        User.findOrCreate({ facebookId: profile.id }, function (err, user) {
          return cb(err, user);
        });
      }
    ));
    





    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user);
        });
    });
}


