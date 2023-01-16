const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Customers = new Schema({
    fullname: {
        type: String
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    address: {
        type: String
    },
    content: { type: String },
    follower: { type: Schema.Types.ObjectId, ref: 'Users'}
})

module.exports = mongoose.model('Customers', Customers)

