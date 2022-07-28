const { check } = require('express-validator')
const Users = require('../models/Users')
const bcrypt = require('bcryptjs')

module.exports = [
    check('oldPassword')
        .exists().withMessage('Vui lòng nhập mật khẩu')
        .notEmpty().withMessage('Không được bỏ trống mật khẩu')
        .isLength({ min: 6 }).withMessage('Mật khẩu phải trên 6 ký tự')
        .custom((value, { req }) => {
            const username = req.session.username;
            return Users.findOne({ username: username })
                .then(user => {
                    const password = user.password;
                    return bcrypt.compareSync(value, password)
                })
                .then(match => {
                    if (match)
                        return true
                    else
                        throw new Error('Mật khẩu cũ không chính xác')
                })
        }),
    check('newPassword')
        .exists().withMessage('Vui lòng nhập mật khẩu')
        .notEmpty().withMessage('Không được bỏ trống mật khẩu')
        .isLength({ min: 6 }).withMessage('Mật khẩu mới phải trên 6 ký tự')
        .custom((value, { req }) => {
            const username = req.session.username;
            return Users.findOne({ username: username })
                .then(user => {
                    const password = user.password;
                    return bcrypt.compareSync(value, password)
                })
                .then(match => {
                    if (!match)
                        return true
                    else
                        throw new Error('Mật khẩu mới không được trùng với mật khẩu cũ')
                })
        }),
    check('reNewPassword')
        .exists().withMessage('Vui lòng nhập mật khẩu')
        .notEmpty().withMessage('Không được bỏ trống mật khẩu')
        .custom((value, { req }) => {
            const newPassword = req.body.newPassword;
            if (newPassword != value) {
                throw new Error('Mật khẩu xác nhận không chính xác')
            } else {
                return true;
            }

        })
]