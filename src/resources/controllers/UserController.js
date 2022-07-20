const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Users = require('../models/Users')

function hashPassword(password) {
    let saltRounds = 10;
    let salt = bcrypt.genSaltSync(saltRounds)
    return bcrypt.hashSync(password, salt)
}

const UserController = {
    getLogin: (req, res, next) => {
        let error = req.flash('error') || '';
        let username = req.flash('username') || '';
        let password = req.flash('password') || '';
        res.render('login', { error, username, password });
    },

    postLogin: (req, res, next) => {
        let result = validationResult(req)
        if (result.errors.length === 0) {
            const { username, password } = req.body
            let account = undefined
            return Users.findOne({ username: username })
                .then(acc => {
                    if (!acc) {
                        req.flash('error', 'Username ' + username + ' không tồn tại');
                        res.redirect('/users/login');
                    } else {
                        account = acc
                        return bcrypt.compareSync(password, acc.password)
                    }
                })
                .then(match => {
                    if (!match) {
                        req.flash('error', 'Mật khẩu không chính xác')
                        res.redirect('/users/login')
                    } else {
                        const JWT_SECRET = 'namthinh';
                        return jwt.sign({
                            username: account.username
                        }, JWT_SECRET, {
                            expiresIn: '30m'
                        }, (err, token) => {
                            if (err) {
                                req.flash('error', 'Đăng nhập thất bại ' + err)
                                res.redirect('/users/login')
                            } else {
                                req.session.username = account.username
                                req.session.token = token
                                req.flash('success', 'Đăng nhập thành công')
                                res.redirect('/home/')
                            }
                        })

                    }
                })
        } else {
            result = result.mapped()
            let message
            for (let f in result) {
                message = result[f].msg
                break
            }
            const { username, password } = req.body;
            req.flash('username', username);
            req.flash('password', password);
            req.flash('error', message)
            res.redirect('/users/login')
        }
    },

    register: (req, res, next) => {
        const user = {
            username: 'admin',
            password: hashPassword('123456')
        }
        new Users(user).save()
            .then((err) => {
                res.json({ message: 'Đăng ký thành công' })
            })
    },

    getLogout: (req, res) => {
        req.session.destroy();
        res.redirect('/users/login');
    },
}

module.exports = UserController;