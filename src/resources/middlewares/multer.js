const multer = require('multer')

let storage = multer.memoryStorage();

module.exports = store = multer({ storage: storage })