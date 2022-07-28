const authPage = (permissions) => {
    return (req, res, next) => {
        const userRole = req.session.position
        if (permissions.includes(userRole)) {
            next()
        } else {
            req.flash("error", 'Bạn không có quyền truy cập chức năng này')
            return res.redirect('/users/logout')
        }
    }
}

module.exports = { authPage }