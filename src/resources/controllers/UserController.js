
const UserController = {
    getLogin: (req, res, next) => {
        return res.render('login');
    },

    postLogin: (req, res, next) => {
        const { username, password } = req.body;

        if(username == 'admin' && password == '123456') {
            return res.redirect('/admin/product-manager');
        }
    }
}

module.exports = UserController;