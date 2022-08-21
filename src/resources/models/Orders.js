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
    product_link: {
        type: String
    },
    status: {
        type: String,
        default: "Chờ xử lý"
    },
    complete: {
        success: { type: Boolean, default: null },
        date: Date
    }
},
    {
        timestamps: true
    })

module.exports = mongoose.model('Orders', Orders)