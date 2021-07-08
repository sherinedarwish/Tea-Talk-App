const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

// Welcome Page
router.get("/", (req, res, next) => {
    res.render("index", { title: "Sherine" });
});


module.exports = router;
