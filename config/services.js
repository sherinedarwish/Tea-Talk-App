const Post = require("../models/Post");
const User = require("../models/User");

//POST METHOD
async function createpost(req, res) {
    const userId = req.user._id;
    const userName = req.user.name;
    const { text } = req.body;
    const newpost = new Post({
        text,
        userId,
        userName
    });

    const response = await newpost
        .save()
        .then((post) => {
            console.log("New post Saved");
        })
        .catch((err) => console.log(err));

    return response;
    
}

// edit profile
async function editprofile(req) {
    const { name, email, password, password2 } = req.body;
    if(name)
        User.findByIdAndUpdate(req.user._id, {name: name},{new:true, useFindAndModify:false}).then(data => console.log(data)).catch(err=> console.error(err));
    if(email)
        User.findByIdAndUpdate(req.user._id, {email: email},{new:true, useFindAndModify:false}).then(data => console.log(data)).catch(err=> console.error(err));
    
}

// GET ALL USERS
async function getusers(req) {
    const data = await User.find().catch((err) => console.error(err));
    return data;
}

// GET METHOD
async function getposts(req) {
    const { searchtext } = req.body;
    const regex = new RegExp(searchtext,"i");
    const posts = await Post.find({text: {$regex : regex}});

    console.log(posts);
    return posts;
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


async function getfriends(req) {
    const friends = req.user.friends;
    var arrayfriends = [];
    
    for(let i=0;i<friends.length;i++)
    {
        const frienddata = await User.findById(friends[i]).catch((err) => console.error(err));
        arrayfriends.push(frienddata);
    }
    
    // friends.forEach(async function(item){
    //     const frienddata = await User.findById(item).catch((err) => console.error(err));
    //     arrayfriends.push(frienddata);
    // })
    
    return arrayfriends;    
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
    getposts,
    getusers,
    addfriend,
    getfriends
};
