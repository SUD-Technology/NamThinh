const multer = require('multer')
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
<<<<<<< HEAD
    // cb(null, 'source/src/public/uploads')
=======
>>>>>>> 441af7dd571e63c600df95991091dd5706dc3894
    cb(null, 'src/public/uploads')
  },
  filename: function (req, file, cb) {
    let ext = file.originalname.substring(file.originalname.lastIndexOf('.'))
    cb(null, file.fieldname + '-' + Date.now() + ext)
  }
})


module.exports = store = multer({ storage: storage })