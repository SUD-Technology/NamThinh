const multer = require('multer')

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'source/src/public/uploads')
  },
  filename: function (req, file, cb) {
    let ext = file.originalname.substring(file.originalname.lastIndexOf('.'))
    cb(null, file.fieldname + '-' + Date.now() + ext)
  }
})

let storageWel = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'source/src/public/uploads/Wel')
  },
  filename: function (req, file, cb) {
    cb(null, req.body.image_name)
  }
})


var store = multer({ 
  storage: storage,
  limits: { fieldSize: 1024 * 1024 * 1024 }
})

var storeWel = multer({
  storage: storageWel,
  limits: { fieldSize: 10 * 1024 * 1024 }
})

module.exports = {store, storeWel}

