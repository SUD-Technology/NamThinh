const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Orders = new Schema({
    Customer: {
        type: {
            fullname: String,
            phone: String,
            email: String,
            address: String
        },
        required: true
    },
    sale: {
        type: String,
        required: true,
    },
    total: {
        type: Number,
        required: true
    },
    product_list: {
        type: String
    },
    status: {
        type: String,
        default: "Chờ xử lý"
    }
})

module.exports = mongoose.model('Orders', Orders)