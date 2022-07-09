const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const Collections = new Schema({
    collection_id: {type: String, unique: true, required: true},
    collection_name: {type: String, required: true},
    slug: {type: String, slug: 'collection_name', unique: true},
},
{
    timestamps: true,
})

module.exports = mongoose.model('Collections', Collections);