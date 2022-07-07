const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Products = new Schema({
    product_id: {type: String, maxlength: 9, unique: true},
    product_name: {type: String, required: true, unique: true},
    product_img: {type: String, required: true},
    description: {type: String, required: true},
    brand_name: {type: String, required: true},
    specification: {type: Object},
    classes: {
        lv1: Number,
        lv2: Number,
        lv3: Number
    },
    price: {type: Number},
    showroom: {type: String},
    represent: {type: String},
    address: {type: String},
    phone: {type: String},
    slug: {type: String, required: true}
},
    {
        timestamps: true
    })

module.exports = mongoose.model('Products', Products);