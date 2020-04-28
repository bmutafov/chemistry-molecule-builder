const mongoose = require('mongoose');

const MoleculeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    formula: {
        type: String,
        required: true,
    },
    solution: {
        type: Array,
        required: true,
    },
});

module.exports = mongoose.model('molecule', MoleculeSchema);
