const express = require("express");
const router = express.Router();
const createpost = require("../config/services").createpost;
const getpost = require("../config/services").getpost;
const getusers = require("../config/services").getusers;
const getpostsByUser = require("../config/services").getpostsByUser;
const deletepost = require("../config/services").deletepost;
const addfriend = require("../config/services").addfriend;
const getpostbysearch= require("../config/services").getpostbysearch;

const { ensureAuthenticated } = require("../config/auth");
const Post = require("../models/Post");


// Welcome Page
router.get("/", (req, res, next) => {
    res.render("index", { title: "TEA TALK" });
});

// Dashboard page
router.get("/dashboard", ensureAuthenticated, async function (req, res, next) {
    const data = await getpostsByUser(req);
    res.render("dashboard", {name: req.user.name , data:data })
});


// POST METHOD
router.post("/dashboard", ensureAuthenticated,async function (req, res, next) {
    await createpost(req, res);
    res.render("dashboard", { name: req.user.name });
});


// // Profile page
// router.get("/search", ensureAuthenticated, async function (req, res, next) {
//    // const data = await getpostbysearch(req);
//     res.render("search", { user: req.user })
// });


router.post('/search', ensureAuthenticated, async (req, res) => {
    const { searchtext } = req.body;
    
    const posts = await Post.find({$text: {$search: searchtext}})
    console.log(posts);
    res.render('search', {posts:posts,  searchtext: searchtext});
   
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
    const data = await getusers(req);
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
    console.log("new data= ", name , email, password, password2);
    //const data = await getpost(req);
    res.render("profile", { user: req.user });
});


router.delete("/delete/:id", ensureAuthenticated, async (req, res) => {
    await deletepost(req, res);
});
module.exports = router;
