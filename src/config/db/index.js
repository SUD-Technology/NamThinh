const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb+srv://hoang:9999@cluster0.e0o28nb.mongodb.net/NamThinh?retryWrites=true&w=majority', {
            // await mongoose.connect('mongodb+srv://sudgroup:9999@namthinh.onhddkl.mongodb.net/NamThinh?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('Success');
    } catch (error) {
        console.log('Fail')
    }
}

module.exports = { connect };