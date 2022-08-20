const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Partners = new Schema({
    partner_name: {type: String, required: true, unique: true},
    image: {type: String}, 
})

module.exports = mongoose.model('Partners', Partners);