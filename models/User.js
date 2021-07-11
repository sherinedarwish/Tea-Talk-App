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
        type: String
    },
    googleId:{
        type: String
    }
});

UserSchema.plugin(findOrCreate);



module.exports = mongoose.model("User", UserSchema);
