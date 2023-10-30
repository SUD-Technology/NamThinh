const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb+srv://sudgroup:9999@namthinh.onhddkl.mongodb.net/NamThinh?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('Connect to db successfully');
    } catch (error) {
        console.log('Fail')
    }
}

module.exports = { connect };