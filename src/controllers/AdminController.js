const fs = require('fs')

const AdminController = {
    addProduct: (req, res) => {
        const file = req.files
        if (!file) {
            res.json({ code: 1, message: "error" })
        } else {
            let imaArray = file.map((file) => {
                let img = fs.readFileSync(file.path)
                return img.toString('base64')
            })
            let listImages = []
            imaArray.map((src, index) => {
                let finalImg = {
                    filename: file[index].originalname,
                    contentType: file[index].mimetype,
                    imageBase64: src
                }
                listImages.push(finalImg)
            })
            res.json({ code: 0, message: listImages })
        }
    },
}

module.exports = AdminController