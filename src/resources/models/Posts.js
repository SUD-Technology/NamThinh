const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Posts = new Schema({
    title: {
        type: String,
        required: true,
        maxlength: 255
    },
    subtitle: {
        type: String,
        required: true
    },
    group: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    content_image: {
        type: [String]
    }

},
    {
        timestamps: true
    })

module.exports = mongoose.model('Posts', Posts);