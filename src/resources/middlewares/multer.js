const multer = require('multer')

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/uploads')
    },
    filename: (req, file, cb) => {
        let ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
        cb(null, Date.now() + ext)
    }
})

module.exports = store = multer({ storage: storage })