const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
        unique: true
    },
    contentType: {
        type: String,
        required: true
    },
    imageBase64: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('imageSchema', imageSchema)