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

// GET CONTACTS FROM ID
async function getpostsByUser(req) {
    const userID = req.user._id;

    const data = await Post.find({ userId: userID }).catch((err) => console.error(err));
    return data;
}

// GET METHOD
async function getpostsbySearch(req) {
    const { searchtext } = req.body;
    const regex = new RegExp(searchtext,"i");
    const posts = await Post.find({text: {$regex : regex}});

   // console.log(posts);
    return posts;
}

// Delete Method
async function deletepost(req, res) {
    Post.findByIdAndRemove(req.params.id)
        .then((data) => console.log("Post deleted"))
        .catch((err) => console.error(err));
    res.redirect("/profile");
}

// get posts
async function getpost(req) {
    const postId = req.params.id;
    const data = await Post.findById(postId).catch((err) =>
        console.error(err)
    );
    return data;
}

// Get all posts
async function getAllPosts(req,res) {

    const allposts = await Post.find().catch((err) =>console.error(err));
    const friends = req.user.friends;
    var array = [];
    var names= [];
    var nofriends = 0;
    for(var i=0;i<allposts.length;i++)
    {
        if(allposts)
        {
            if(friends!="")
            {

                for(var j=0;j<friends.length;j++)
                {                
                    if(allposts[i].userId.equals(friends[j]))
                    {
                        array.push(allposts[i]);
                        const data = await User.findById({ _id: friends[j]}).catch((err) => console.error(err));
                        names.push(data.name)
                    }
                    if(allposts[i].userId.equals(req.user._id))
                    {
                        array.push(allposts[i]);
                        names.push(req.user.name)

                        break;
                    }
                }
            }
            else
            {
                nofriends=1;
                console.log("user has no friends now");
                const userID = req.user._id;
                const array = await Post.find({ userId: userID }).catch((err) => console.error(err));
                for(var i =0;i<array.length;i++)
                {
                    names.push(req.user.name)
                }
            
                res.render("dashboard", {name: req.user.name , data:array , names: names})
                break;

            }
            
        }
        else
            break;
    }
    if(nofriends == 0)
    {
        res.render("dashboard", {name: req.user.name , data:array , names: names})

    }
}

// Get names for all posts
async function getNamesforAllPosts(req) {
    const allposts = await Post.find().catch((err) =>console.error(err));
    const friends = req.user.friends;
    const friendaccount = []
    for(var i=0;i<friends.length;i++)
    {
        const data = await User.findById({ _id: friends[i]}).catch((err) => console.error(err));
        friendaccount.push(data.name)
    }
    var names = [];
    
    return names;
}

                            //////////////////////////////////// Users ///////////////////////////////////////////////
// GET ALL USERS
async function getusers(req) {
    const data = await User.find().catch((err) => console.error(err));
    const userID = req.user._id;
    var i =0;

    data.forEach(function(obj)
    {

        if (obj.id == userID)
        {
            index = i;
            data.splice(index, 1);
        }
        i++;
    })

    return data;
}

// Get All Friends
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

// Get People you may know
async function getpeople(req) {
    const friends = req.user.friends;
    var unknownpeople = [];

    const Allpeople = await User.find().catch((err) => console.error(err));
    if(!Allpeople) /// All of them are friends
        return Allpeople;
    let found =0;
    for(let i=0;i<Allpeople.length;i++)
    {
        for(let j =0;j<friends.length;j++)
        {
            if(Allpeople[i]._id.equals(friends[j]))
            {
                found = 1;
                break;
            }
        }

        if(found == 0)
        {
            if(Allpeople[i]._id.equals(req.user._id))
            {
            }
            else
            {
                unknownpeople.push(Allpeople[i])
                
            }
        }
        found = 0;

    }
    
    
    return unknownpeople;    
}

// Add friend
async function addfriend(req,res) {
    const user = req.user

    const friendId = req.params.id;

    const Newfriend = await User.findById(friendId).catch((err) => console.error(err));

    const friends = user.friends;
    var m = 0;
    if (friends.length === 0)
    { 
        friends.push(Newfriend._id);
        const updated = User.findByIdAndUpdate(user._id,{friends},{useFindAndModify: false}).then(data => console.log(data)).catch(err=> console.error(err));
        return updated;
    }
    else
    {
        for(let i=0;i<friends.length;i++)
        {
            if(Newfriend._id.equals(friends[i]))
            {   
                m = 1;
                return user;
            }
        }
        if (m == 0)
        {
            friends.push(Newfriend._id);
            User.findByIdAndUpdate(user._id,{friends}, {useFindAndModify: false}).catch(err=> console.error(err));
            return user;
        }
    
    };
}

// delete friend
async function deletefriend(req, res) {
    const friendId = req.params.id;

    var friends = req.user.friends;

    var i =0;
    for(i=0;i<friends.length;i++)
    {
        if(friendId==friends[i])
        {   
            index = i;
            friends.splice(index, 1);
        }
    }
    

    await User.findByIdAndUpdate(req.user._id,{friends}, {useFindAndModify: false}).catch(err=> console.error(err));
    res.redirect("/friends")
   
}

















module.exports = {
    deletefriend,
    createpost,
    getNamesforAllPosts,
    getpost,
    getAllPosts,
    deletepost,
    getpostsByUser,
    getpost,
    getpostsbySearch,
    getusers,
    addfriend,
    getfriends,
    getpeople
    
};
