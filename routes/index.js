const express = require("express");
const router = express.Router();
const createpost = require("../config/services").createpost;
const getposts = require("../config/services").getposts;
const getusers = require("../config/services").getusers;
const getpostsByUser = require("../config/services").getpostsByUser;
const deletepost = require("../config/services").deletepost;
const addfriend = require("../config/services").addfriend;
const getpostbysearch= require("../config/services").getpostbysearch;
const getfriends= require("../config/services").getfriends;

const { ensureAuthenticated } = require("../config/auth");
const Post = require("../models/Post");
const User = require("../models/User");


// Welcome Page
router.get("/", (req, res, next) => {
    res.render("index", { title: "TEA TALK" });
});


// POST METHOD
router.post("/dashboard", ensureAuthenticated,async function (req, res, next) {
    await createpost(req, res)
        .then((done) =>
            res.render("dashboard", { name: req.user.name })
        );
    
});

// Dashboard page
router.get("/dashboard", ensureAuthenticated, async function (req, res, next) {
    const data = await getpostsByUser(req);
    res.render("dashboard", {name: req.user.name , data:data })
});



// // Profile page
// router.get("/search", ensureAuthenticated, async function (req, res, next) {
//    // const data = await getpostbysearch(req);
//     res.render("search", { user: req.user })
// });


router.post('/search', ensureAuthenticated, async (req, res) => {
    const { searchtext } = req.body;
    
    const data = await getposts(req);
    res.render('search', {posts:data,  searchtext: searchtext});
   
})

// GET ALL PEOPLE PAGE
router.get("/people", ensureAuthenticated, async function (req, res, next) {
    const data = await getusers(req);
    res.render("people", { data:data });
});


router.post("/add/:id", ensureAuthenticated, async function (req, res, next) {
     await addfriend(req,res);
    res.render("friends", { user: req.user });
});



// GET ALL FRIENDS PAGE
router.get("/friends", ensureAuthenticated, async function (req, res, next) {
    const data = await getfriends(req);
    console.log("friends are = " , data)
    res.render("friends", { data:data });
});


// Profile page
router.get("/profile", ensureAuthenticated, async function (req, res, next) {
    const data = await getpostsByUser(req);
    res.render("profile", { user: req.user , data:data })
});

// Edit profile
router.get("/editprofile", ensureAuthenticated, (req, res) =>
    res.render("editprofile", {
        user: req.user
    })
);



// Edit
router.put("/editprofile", ensureAuthenticated, async (req, res) => {
    const { name, email, password, password2 } = req.body;
    const errors = [];

    if (password !== password2) {
        errors.push({ msg: "Passwords do not match" });
    }
    // Check password length
    if( password.length < 6)
    {
        errors.push ({ msg:"Password is too short"});
    }
    if (errors.length > 0 )
    {
        res.render('register',{ 
            errors,
            name,
            email,
            password,
            password2
        });
        console.log(errors);
    }
    else
    {
        // Validation Pass
        User.findOne({ email:email })
        .then(user => {
            if(user)
            {
                // USER EXISTS
                errors.push({ msg: "Email is already registered"});
                res.render('register',{ 
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }
            else
            {
                // Hash Password
                bcrypt.genSalt(10,(err,salt) =>
                    bcrypt.hash(password , salt , (err, hash) => {  password = hash }));
                       
                User.findByIdAndUpdate(req.user._id, {name: name , email:email , password:password , password2:password2},{new:true, useFindAndModify:false})
                .then(user => {
                    res.redirect('/profile')})
                .catch(err=> console.error(err));
            }
        })

    }


 //   await editprofile(req);
    res.render("profile", { user: req.user });
});


router.delete("/delete/:id", ensureAuthenticated, async (req, res) => {
    await deletepost(req, res);
});
module.exports = router;
