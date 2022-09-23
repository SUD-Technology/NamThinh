const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Products = new Schema({
    product_id: { type: String, unique: true },
    product_name: { type: String, required: true },
    product_img: { type: [String] },
    description: { type: String, required: true },
    brand_name: { type: String, required: true },
    product_model: { type: String, required: true },
    product_origin: { type: String, required: true },
    classes: {
        lv1: Number,
        lv2: Number,
        lv3: Number
    },
    price: { type: Number },
    showPrice: { type: Number },
    size: { type: String },
    amount: { type: Number },
    inventory: { type: Number },
    status: { type: String, default: '' },
    slug: { type: String, required: true }
},
    {
        timestamps: true
    })

module.exports = mongoose.model('Products', Products);