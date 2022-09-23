const express = require('express');
const router = express.Router();
const NewsController = require('../controllers/NewsController');
const fs = require('fs')
const ImageContent = require('../models/ImageContent')
const multipart = require('connect-multiparty')
const multipartMiddleware = multipart();
router.get('/', NewsController.getPostList);
router.get('/group/:slug', NewsController.getGroupNews);
router.post('/upload', multipartMiddleware, (req, res) => {
    try {
        fs.readFile(req.files.upload.path, function (err, data) {
            let newPath = 'src/public/uploads/' + req.files.upload.name;
            fs.writeFile(newPath, data, function (err) {
                if (err) console.log({ err: err });
                else {
                    console.log(req.files.upload.originalFilename);
                    let fileName = req.files.upload.name;
                    let url = '/uploads/' + fileName;
                    let msg = 'Tải lên thành công';
                    let funcNum = req.query.CKEditorFuncNum;
                    console.log({ url, msg, funcNum });
                    ImageContent.create({ url })
                        .then(() => {
                            console.log('Upload successfully')
                            res.status(201).send("<script>window.parent.CKEDITOR.tools.callFunction('" + funcNum + "','" + url + "','" + msg + "');</script>");
                        })
                }
            });
        });
    } catch (error) {
        console.log(error.message);
    }
})
router.get('/:slug', NewsController.getDetailPost);

module.exports = router;