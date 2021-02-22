const mongoose = require('mongoose');

const trainingSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String, 
        required: true
    },
    exercises: [{
        type: Object,
        ref: 'Exercises'
    }],
    lastChanged: {
        type: String, 
        required: true
    },
    user: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Training', trainingSchema);