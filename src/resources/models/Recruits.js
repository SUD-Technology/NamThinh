const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Recruits = new Schema({
    position: { type: String, required: true },
    location: { type: String},
    image: { type: String },
    salary: { type: String },
    content: { type: String, required: true },
    slug: { type: String, unique: true }
},
{
    timestamps: true
}
)

module.exports = mongoose.model('Recruits', Recruits);