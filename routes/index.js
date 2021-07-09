const express = require("express");
const router = express.Router();
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



module.exports = router;
