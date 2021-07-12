const Post = require("../models/Post");
const User = require("../models/User");

//POST METHOD
async function createpost(req, res) {
    const userId = req.user._id;
    const { text } = req.body;

    const newpost = new Post({
        text,
        userId,
    });

    newpost
        .save()
        .then((post) => {
            console.log("New post Saved");
        })
        .catch((err) => console.log(err));
}

async function getusers(req) {
    const data = await User.find().catch((err) => console.error(err));
    return data;
}


// GET METHOD
async function getposts(req, res) {
    const data = await Post.find().catch((err) => console.error(err));
    return data;
}

// GET CONTACTS FROM ID
async function getpostsByUser(req) {
    const userID = req.user._id;
    console.log("userID= " , userID);
    
    const data = await Post.find({ userId: userID }).catch((err) => console.error(err));
    return data;
}

// Delete Method
async function deletepost(req, res) {
    Post.findByIdAndRemove(req.params.id)
        .then((data) => console.log(data))
        .catch((err) => console.error(err));
    res.redirect("/viewall");
}

// Update
async function getpost(req) {
    const postId = req.params.id;
    const data = await Post.findById(postId).catch((err) =>
        console.error(err)
    );
    return data;
}

module.exports = {
    createpost,
    getpost,
    deletepost,
    getpostsByUser,
    getpost,
    getusers
};
