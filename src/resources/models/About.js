const mongoose = require('mongoose')
const Schema = mongoose.Schema

const About = new Schema({
    content: {type: String}
})

module.exports = mongoose.model('About', About);