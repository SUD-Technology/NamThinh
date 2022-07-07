
const UserController = {
    getLogin: (req, res, next) => {
        return res.render('login');
    }
}

module.exports = UserController;