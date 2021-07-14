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
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    facebookId:{
        type: mongoose.Schema.Types.ObjectId
    },
    googleId:{
        type: String
    },
    friends: [{ 
        type : mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }]
});

UserSchema.plugin(findOrCreate);



module.exports = mongoose.model("User", UserSchema);
