const mongoose = require('mongoose');

const exerciseSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    exerciseImage: {type: String, required: true},
    tags: {type: String, required: true},
    dateCreated: {type: String, required: true},
    markdown: {type: String, required: true},
    views: {type: Number, default: 0},
});

module.exports = mongoose.model('Exercise', exerciseSchema);


