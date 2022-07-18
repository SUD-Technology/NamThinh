const fs = require('fs')
const Products = require('../models/Products')
const slugify = require('slugify');
const path = require('path')
function unique(arr) {
    return Array.from(new Set(arr)) //
}

function listPage(length) {
    return Array.from({ length: length }, (_, i) => i + 1)
}

const AdminController = {
    addProduct: (req, res) => {
        const file = req.files
        console.log(file)
        const { product_id, product_name, product_model, product_categories, product_branch, product_origin, product_description } = req.body
        let listImages = []
        if (!file) {
            res.json({ code: 1, message: "error" })
        } else {
            file.map(f => {
                let url = f.firebaseUrl.split('/').pop();
                listImages.push(url)
            })
        }
        const classes = {
            lv1: Number(product_categories[0]),
            lv2: Number(product_categories[1]),
            lv3: Number(product_categories[2])
        }
        const slug = slugify(product_name + ' ' + product_id, {
            replacement: '-',
            remove: false,
            lower: false,
            strict: false,
            locale: 'vi',
            trim: true
        })
        const product = {
            product_id: product_id,
            product_name: product_name,
            product_img: listImages,
            description: product_description,
            product_model: product_model,
            product_origin: product_origin,
            brand_name: product_branch,
            classes: classes,
            slug: slug
        }
        res.json({ code: 1, message: "Thêm sản phẩm thành công", listImage: listImages })
        // return new Products(product).save()
        //     .then(() => {
        //         // res.json({ code: 1, message: "Thêm sản phẩm thành công" })
        //         res.redirect('/admin/add-product')
        //     })
        //     .catch((err) => {
        //         res.json({ code: 0, message: "Thêm sản phẩm thất bại", err: err })
        //     })
    },

    deleteProduct: (req, res, next) => {
        const product_id = req.params.id;
        Products.findOne({ product_id })
            .then(product => {
                if (!product) {
                    return res.json({ success: false, msg: 'Sản phẩm không tồn tại', product_id });
                }

                product.delete().then(res.redirect('/home'));
            })
    },
    getProductManager: (req, res, next) => {
        let totalProduct = Products.find({}).count()
        let listPages = totalProduct <= 10 ? ['1'] : listPage(Math.round(totalProduct / 10))
        let page = req.query.page;
        if (page) {
            page = parseInt(page)
            let pageSize = 10
            let skip = (page - 1) * pageSize
            let nextPage = page + 1;
            let previousPage = page <= 1 ? 1 : page - 1;
            Products.find({}).skip(skip).limit(pageSize)
                .then(products => {
                    if (products.length == 0) {
                        return res.json({ success: false, msg: 'Không có sản phẩm nào trong kho' });
                    } else {
                        let productList = []
                        let brands = []
                        let origins = []
                        products.forEach(product => {
                            const current_product = {
                                pname: product.product_name,
                                pimg: product.product_img[0],
                                pid: product.product_id,
                                pslug: product.slug,
                                price: product.price ? product.price.toLocaleString('vi', { style: 'currency', currency: 'VND' }) : 'Liên hệ',
                                model: product.product_model,
                                origin: product.product_origin,
                            }
                            brands.push(product.brand_name)
                            origins.push(product.product_origin)
                            productList.push(current_product)
                        })

                        brands = unique(brands)
                        origins = unique(origins)
                        res.render('productManager', { admin: true, products: productList, brands, origins, listPages })
                    }
                })
        }
        else {
            Products.find({})
                .then(products => {
                    if (products.length == 0) {
                        return res.json({ success: false, msg: 'Không có sản phẩm nào trong kho' });
                    }
                    else {
                        let productList = []
                        let brands = []
                        let origins = []
                        products.forEach(product => {
                            const current_product = {
                                pname: product.product_name,
                                pimg: product.product_img[0],
                                pid: product.product_id,
                                pslug: product.slug,
                                price: product.price ? product.price.toLocaleString('vi', { style: 'currency', currency: 'VND' }) : 'Liên hệ',
                                model: product.product_model,
                                origin: product.product_origin,
                            }
                            brands.push(product.brand_name)
                            origins.push(product.product_origin)
                            productList.push(current_product)
                        })

                        brands = unique(brands)
                        origins = unique(origins)

                        res.render('productManager', { admin: true, products: productList, brands, origins })
                    }
                })
        }
    }
}

module.exports = AdminController