const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Customers = new Schema({
    fullname: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    address: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Customers', Customers)

