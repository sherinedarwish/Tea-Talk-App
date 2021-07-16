const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
});

PostSchema.index({ title: 'text', description: 'text', tags: 'text' });

const PostModel = mongoose.model("post", PostSchema,'posts');
PostModel.createIndexes();

module.exports = PostModel;
