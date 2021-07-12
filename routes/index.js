const express = require("express");
const router = express.Router();
const createpost = require("../config/services").createpost;
const getpost = require("../config/services").getpost;
const getusers = require("../config/services").getusers;
const getpostsByUser = require("../config/services").getpostsByUser;


const { ensureAuthenticated } = require("../config/auth");

// Welcome Page
router.get("/", (req, res, next) => {
    res.render("index", { title: "TEA TALK" });
});

// Dashboard page
router.get("/dashboard", ensureAuthenticated, async function (req, res, next) {
    const data = await getpostsByUser(req);
    console.log("posts= ",data);
    res.render("dashboard", {name: req.user.name , data:data })
});


// POST METHOD
router.post("/dashboard", ensureAuthenticated,async function (req, res, next) {
    await createpost(req, res);
    res.render("dashboard", { name: req.user.name });
});

// GET ALL PEOPLE PAGE
router.get("/people", ensureAuthenticated, async function (req, res, next) {
    const data = await getusers(req);
    res.render("people", { data:data });
});


// Profile page
router.get("/profile", ensureAuthenticated, async function (req, res, next) {
    const data = await getpostsByUser(req);
    console.log("posts= ",data);

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
module.exports = router;
