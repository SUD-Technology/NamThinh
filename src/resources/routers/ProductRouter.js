const express = require('express');
const router = express.Router();
const Products = require('../models/Products');

router.get('/:slug', (req, res, next) => {
    Products.findOne({ slug: req.params.slug })
        .then(product => {
            if (!product) {
                return res.json({ success: false, msg: 'Không tìm thấy sản phẩm nào' });
            }

            let data = {
                pid: product.product_id || '',
                pname: product.product_name || '',
                pimg: product.product_img || '',
                description: product.description || '',
                model: product.product_model || '',
                branch: product.brand_name || '',
                price: product.price ? product.price.toLocaleString('vi', { style: 'currency', currency: 'VND' }) : 'Liên hệ',
            }
            return res.render('detail', { data });
        })
        .catch(next);
})

module.exports = router;