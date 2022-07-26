const { check } = require('express-validator')
const Users = require('../models/Users')
const bcrypt = require('bcryptjs')

module.exports = [
    check('username')
        .exists().withMessage('Vui lòng nhập tên đăng nhập')
        .notEmpty().withMessage('Tên đăng nhập không được bỏ trống')
        .isLength({ min: 5 }).withMessage('Tên đăng nhập không hợp lệ')
    ,
    check('password')
        .exists().withMessage('Vui lòng nhập mật khẩu')
        .notEmpty().withMessage('Không được bỏ trống mật khẩu')
        .isLength({ min: 6 }).withMessage('Mật khẩu không hợp lệ')
        .custom((value, { req }) => {
            const username = req.body.username
            return Users.findOne({ username: username })
                .then(user => {
                    if (!user) {
                        throw new Error('Tên đăng nhập không tồn tại')
                    } else {
                        return bcrypt.compareSync(value, user.password)
                    }
                })
                .then(match => {
                    if (match) {
                        return true
                    } else {
                        throw new Error('Mật khẩu không chính xác')
                    }
                })
        })
]