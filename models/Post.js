const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
});

const PostModel = mongoose.model("post", PostSchema,'posts');
module.exports = PostModel;
