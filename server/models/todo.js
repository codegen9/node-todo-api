const mongoose = require('mongoose');

const ToDo = mongoose.model('ToDo', {
    text: {
        type: String
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }
});

module.exports = {
    ToDo
}