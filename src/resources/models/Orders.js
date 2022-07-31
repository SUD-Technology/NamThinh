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
        required: true
    },
    address: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Chờ xử lý", "Đã gọi điện thoại", "Đã gặp", "Đã gữi thông báo giá", "Đã chốt đơn"],
        default: "Chờ xử lý"
    }
})

const Orders = new Schema({
    Customer: {
        type: Customers,
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
    }

})

module.exports = mongoose.model('Orders', Orders)