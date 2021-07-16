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

// GET ALL USERS
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

    const data = await Post.find({ userId: userID }).catch((err) => console.error(err));
    return data;
}

// Delete Method
async function deletepost(req, res) {
    Post.findByIdAndRemove(req.params.id)
        .then((data) => console.log(data))
        .catch((err) => console.error(err));
    res.redirect("/profile");
}

// Update posts
async function getpost(req) {
    const postId = req.params.id;
    const data = await Post.findById(postId).catch((err) =>
        console.error(err)
    );
    return data;
}

// Add friend
async function addfriend(req,res) {
    const user = req.user

    const friendId = req.params.id;

    const Newfriend = await User.findById(friendId).catch((err) => console.error(err));

    const friends = user.friends;
    var i = 0;
    if (friends.length === 0)
    { 
        friends.push(Newfriend._id);
        const updated = User.findByIdAndUpdate(user._id,{friends},{useFindAndModify: false}).then(data => console.log(data)).catch(err=> console.error(err));
        return updated;
    }
    else
    {
        friends.forEach((friend)=>
        {
            if(Newfriend._id.equals(friend))
            {   
                i = 1;
                return user;
            }
            
        })
        if (i == 0)
        {
            friends.push(Newfriend._id);
            User.findByIdAndUpdate(user._id,{friends}, {useFindAndModify: false}).then(data => console.log(data)).catch(err=> console.error(err));
            return user;
        }
    
    };

}



module.exports = {
    createpost,
    getpost,
    deletepost,
    getpostsByUser,
    getpost,
    getusers,
    addfriend
};
