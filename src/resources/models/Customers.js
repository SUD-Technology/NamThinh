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
        enum: ["Đã gọi điện thoại", "Đã gặp", "Đã gữi thông báo giá", "Đã chốt đơn"],
        default: "Chờ xử lý"
    }
})

module.exports = mongoose.model('Customers', Customers)

