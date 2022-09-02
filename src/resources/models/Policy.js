const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Policy = new Schema({
    name: {type: String, required: true},
    content: {type: String, required: true},
    slug: {type: String, unique: true}
})

module.exports = mongoose.model('Policy', Policy);