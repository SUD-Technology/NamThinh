const Products = require("../models/Products")

let getProductList = async (req, res, next) => {
    await Products.find({})
        .then(products => {
            if (products.length == 0) {
                return res.json({ success: false, msg: 'Không có sản phẩm nào trong kho' });
            }
            req.products = products.reverse();
            next()
        })
}

module.exports = getProductList;