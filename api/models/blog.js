const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    markdown: {type: String, required: true},
    date: {type: String, required: true},
    blogImage: {type: String, required: true},
    title: {type: String, required: true},
});

module.exports = mongoose.model('Blog', blogSchema);