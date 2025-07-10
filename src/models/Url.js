const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true,
    },
    shortCode: {
        type: String,
        required: true,
        unique: true,
    },
    clicks: {
        type: Number,
        required: true,
        default: 0,
    }
}, {

    timestamps: true,
});

module.exports = mongoose.model('Url',urlSchema);
