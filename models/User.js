const mongoose = require("mongoose");
var findOrCreate = require('mongoose-findorcreate')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        //required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    friends: [{ 
        type : mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    avatar: {
        type: String,
    },
    cloudinary_id: {
        type: String,
    },
    like: {
        type: Number
    },
    dislike: {
        type: Number
    },
    facebook : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }
    

});

UserSchema.plugin(findOrCreate);



module.exports = mongoose.model("User", UserSchema);
