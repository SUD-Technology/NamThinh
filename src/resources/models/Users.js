const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Users = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    position: {
        type: String,
        enum: ["sale", "accountant"],
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
})

module.exports = mongoose.model('Users', Users)