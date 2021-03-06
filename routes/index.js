const express = require("express");
const router = express.Router();
const createpost = require("../config/services").createpost;
const getpostsbySearch = require("../config/services").getpostsbySearch;
const getusers = require("../config/services").getusers;
const getpostsByUser = require("../config/services").getpostsByUser;
const deletepost = require("../config/services").deletepost;
const addfriend = require("../config/services").addfriend;
const getfriends= require("../config/services").getfriends;
const deletefriend= require("../config/services").deletefriend;
const getAllPosts= require("../config/services").getAllPosts;
const getpeople= require("../config/services").getpeople;

const bcrypt = require('bcryptjs');
const upload = require ("../config/multer");
const { ensureAuthenticated } = require("../config/auth");
const Post = require("../models/Post");
const User = require("../models/User");
const cloudinary = require('cloudinary').v2;
// Welcome Page
router.get("/", (req, res, next) => {
    res.render("index", { title: "TEA TALK" });
});


// POST METHOD
router.post("/dashboard", ensureAuthenticated,async function (req, res, next) 
{
    await createpost(req, res);
    await getAllPosts(req,res);       
});

// Dashboard page
router.get("/dashboard", ensureAuthenticated, async function (req, res, next) {
    await getAllPosts(req,res);   
    
});

// Search for a post 
router.post('/search', ensureAuthenticated, async (req, res) => {
    const { searchtext } = req.body;
    const [data,names] = await getpostsbySearch(req);
    console.log("names ===== ", names);
    res.render('search', {posts:data, names:names, searchtext: searchtext});
   
})

// Add a friend
router.post("/add/:id", ensureAuthenticated, async function (req, res, next) {
    const result = await addfriend(req,res).catch(err=> console.error(err));
    const data = await getfriends(req); 

    res.render("friends", { user: req.user , data:data});
});


// GET ALL FRIENDS PAGE
router.get("/friends", ensureAuthenticated, async function (req, res, next) {
    const data = await getfriends(req); 
    res.render("friends", { data:data });
});

// GET ALL PEOPLE PAGE
router.get("/people", ensureAuthenticated, async function (req, res, next) {
    const data = await getpeople(req);
    res.render("people", { data:data });
});


// Profile page
router.get("/profile", ensureAuthenticated, async function (req, res, next) {
    const data = await getpostsByUser(req);
    let image_exists = 0;
    if (req.user.cloudinary_id)
    {
         image_exists = 1;
    }
    res.render("profile", { user: req.user , data:data  , image_exists:image_exists})
});

// Edit profile
router.get("/editprofile", ensureAuthenticated, async function (req, res, next) {
    let image_exists = 0;
    if (req.user.cloudinary_id)
    {
         image_exists = 1;
    }
    res.render("editprofile", { user: req.user , image_exists:image_exists})
});

// Upload a picture
router.post("/upload",upload.single('image'), ensureAuthenticated, async function (req, res, next) {
    try{

    
    let image_exists = 0;
    if (req.user.cloudinary_id )
    {
        await cloudinary.uploader.destroy(req.user.cloudinary_id);
        image_exists = 1;
        const result = await cloudinary.uploader.upload(req.file.path);
        console.log("result file =",result);
        await User.findByIdAndUpdate(req.user._id, {avatar: result.secure_url, cloudinary_id:result.public_id},{new:true, useFindAndModify:false})
        res.render("editprofile", { user: req.user, image_exists:image_exists})
    }
    else
    {
        const result = await cloudinary.uploader.upload(req.file.path);
        console.log("result file =",result);

        await User.findByIdAndUpdate(req.user._id, {avatar: result.secure_url, cloudinary_id:result.public_id},{new:true, useFindAndModify:false})
        res.render("editprofile", { user: req.user, image_exists:image_exists})
    }
    }
    catch(err) {
        res.status(500).send(err)
    }
});

//delete a picture
router.delete("/deleteAvatar", ensureAuthenticated, async function (req, res, next) {
    
    await cloudinary.uploader.destroy(req.user.cloudinary_id);
    let image_exists = 0;
    console.log("req user id ", req.user._id)
    const result = await User.updateOne({"_id":req.user._id},{$unset: { avatar: 1 , cloudinary_id:1}});
    console.log("result",result);
    res.redirect("/editprofile");
});


// Edit profile by method put
router.put("/editusername", ensureAuthenticated, async (req, res) => {
    const { name } = req.body;
    await User.updateOne({_id: req.user._id}, {$set: {name: name }}).catch(err=> console.error(err));

    let image_exists = 0;
    if (req.user.cloudinary_id)
    {
         image_exists = 1;
    }
    res.redirect("/editprofile");
});
// Edit profile by method put
router.put("/edituseremail", ensureAuthenticated, async (req, res) => {
    const { email } = req.body;
    const errors = [];

    if (errors.length > 0 )
    {
        res.render('editprofile',{ 
            errors,
            email
        });
        console.log(errors);
    }
    else
    {
        await User.findOne({ email:email })
        .then(async function (user) {
            if(user)
            {
                // USER EXISTS
                errors.push({ msg: "Email is already registered"});
                res.render('editprofile',{ 
                    errors,
                    email,
                });
            }
            else
            {
                 await User.updateOne({_id: req.user._id}, {$set: {email: email }}).catch(err=> console.error(err));
            }
        })
     }

    let image_exists = 0;
    if (req.user.cloudinary_id)
    {
         image_exists = 1;
    }
    res.redirect("/editprofile");
});

// Edit profile by method put
router.put("/edituserpassword", ensureAuthenticated, async (req, res) => {
    const { password, password2 } = req.body;
    const errors = [];
    let image_exists = 0;
    if (req.user.cloudinary_id)
    {
         image_exists = 1;
    }
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
        res.render('editprofile',{ 
            errors,
            password,
            password2,
            image_exists:image_exists, user:req.user
        });
        console.log(errors);
    }
    else
    { 
        // Hash Password
        bcrypt.genSalt(10,(err,salt) =>
            bcrypt.hash(password , salt , (err, hash) => {
                
                if(err) throw err;
                // set password to hashed
                User.updateOne({_id: req.user._id}, {$set: {password: hash }}).catch(err=> console.error(err))
                .then(user => {
                   req.flash("success_msg","You successfully changed the password")
                   res.redirect('/editprofile')})
               .catch(err=> console.error(err));
            }));

            
    }
});

// Edit a post
router.get("/editpost/:id", ensureAuthenticated, async (req, res) => {
    const postId = req.params.id;
    const data = await Post.findById(req.params.id).catch(err=> console.error(err));
    console.log(data);
    res.render("editpost", {data:data });
});

//Edit profile by method put
router.put("/editpost/:id", ensureAuthenticated, async (req, res) => {
    const { text } = req.body;
    const postId = req.params.id;
    Post.findByIdAndUpdate(postId, {text},{new:true, useFindAndModify:false})
    .then(user => {
        res.redirect('/profile')})
    .catch(err=> console.error(err));
          
});

// Delete the user's post
router.delete("/deletepost/:id", ensureAuthenticated, async (req, res) => {
    await deletepost(req, res);
});

// Delete a friend
router.delete("/deletefriend/:id", ensureAuthenticated, async (req, res) => {
    await deletefriend(req, res);
});
module.exports = router;
