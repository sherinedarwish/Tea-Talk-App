const express = require("express");
const router = express.Router();
const createpost = require("../config/services").createpost;
const getpost = require("../config/services").getpost;


const { ensureAuthenticated } = require("../config/auth");

// Welcome Page
router.get("/", (req, res, next) => {
    res.render("index", { title: "TEA TALK" });
});

// Dashboard page
router.get("/dashboard", ensureAuthenticated, (req, res) =>
    res.render("dashboard", {
        name: req.user.name,
    })
);


// POST METHOD
router.post("/dashboard", async function (req, res, next) {
    await createpost(req, res);
    res.render("dashboard", { name: req.user.name });
});

// Dashboard page
router.get("/profile", ensureAuthenticated, (req, res) =>
    res.render("profile", {
        user: req.user
    })
);

// DEdit profile
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
