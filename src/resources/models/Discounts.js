const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Discounts = new Schema({
    title: {
        type: String,
        required: true,
        maxlength: 255
    },
    subtitle: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true
    },
    image: {
        type: String
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

module.exports = mongoose.model('Discounts', Discounts);