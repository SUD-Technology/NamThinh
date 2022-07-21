const { check } = require('express-validator')
const Users = require('../models/Users')

module.exports = [
    check('username')
        .exists().withMessage('Vui lòng nhập tên đăng nhập')
        .notEmpty().withMessage('Tên đăng nhập không được bỏ trống')
        .isLength({ min: 5 }).withMessage('Tên đăng nhập phải trên 6 ký tự'),

    check('password')
        .exists().withMessage('Vui lòng nhập mật khẩu')
        .notEmpty().withMessage('Không được bỏ trống mật khẩu')
        .isLength({ min: 6 }).withMessage('Mật khẩu phải trên 6 ký tự'),

    check('username')
        .custom((value) => {
            return Users.findOne({ username: value })
                .then(match => {
                    if (match)
                        throw new Error("Tên đăng nhập đã tồn tại")
                    else
                        return true
                })
        }),

    check('rePassword')
        .exists().withMessage('Vui lòng xác nhận mật khẩu')
        .notEmpty().withMessage('Vui lòng xác nhận mật khẩu')
        .custom((value, { req }) => {
            let password = req.body.password;
            if (value != password)
                throw new Error("Mật khẩu xác nhận không đúng")
            else
                return true
        }),

]