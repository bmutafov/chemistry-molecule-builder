const mongoose = require('mongoose');

const ElementSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    sign: {
        type: String,
        required: true,
    },
    bgColor: {
        type: String,
        required: true,
    },
    labelColor: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('element', ElementSchema);
