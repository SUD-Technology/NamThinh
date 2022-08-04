const fs = require('fs')
const Products = require('../models/Products')
const slugify = require('slugify');
const path = require('path')
const Orders = require('../models/Orders')
const Customers = require('../models/Customers')

function unique(arr) {
    return Array.from(new Set(arr)) //
}

const AdminController = {
    getAddProduct: (req, res, next) => {
        const error = req.flash('error') || "";
        const success = req.flash('success') || ""
        res.render('addProduct', { position: req.session.position, error, success })
    },
    addProduct: (req, res) => {
        const file = req.files
        console.log(file)
        const { product_id, product_name, product_model, product_categories, product_branch, product_origin, product_description, product_amount } = req.body
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
            amount: product_amount,
            classes: classes,
            slug: slug
        }
        return new Products(product).save()
            .then(() => {
                res.flash('success', 'Thêm sản phẩm thành công')
                res.redirect('/admin/add-product')
            })
            .catch((err) => {
                res.flash('error', 'Thêm sản phẩm thất bại')
                res.redirect('/admin/add-product')
            })
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
        let p_name = ""
        if (req.query.product_name)
            p_name = { $regex: `${req.query.product_name}`, "$options": "i" }
        const query = {
            product_origin: req.query.origin || "",
            brand_name: req.query.brand || "",
            product_name: p_name
        }

        for (let x in query) {
            if (query[x] == "")
                delete query[`${x}`]
        }

        let level

        if (!req.query.lv1 && !req.query.lv2 && !req.query.lv3) {
            level = {}
        } else if (!req.query.lv2 && !req.query.lv3) {
            query["classes.lv1"] = req.query.lv1
        } else if (!req.query.lv3) {
            query["classes.lv1"] = req.query.lv1
            query["classes.lv2"] = req.query.lv2
        } else {
            query["classes.lv1"] = req.query.lv1
            query["classes.lv2"] = req.query.lv2
            query["classes.lv3"] = req.query.lv3
        }

        let page = req.query.page || 1
        page = parseInt(page)
        let pageSize = 20
        let skip = (page - 1) * pageSize
        let nextPage = page + 1;
        let previousPage = page <= 1 ? 1 : page - 1;

        // res.json({ query: query })

        return Products.find(query).skip(skip).limit(pageSize).exec((err, products) => {
            Products.countDocuments(query, (err, count) => {
                if (err) return next(err);
                if (products.length == 0) {
                    return res.render('productManager', {
                        position: req.session.position,
                        products: [],
                        current: 1,
                        pages: 1,
                        lv1: req.query.lv1 || '',
                        lv2: req.query.lv2 || '',
                        lv3: req.query.lv3 || '',
                        brand: req.query.brand || '',
                        origin: req.query.origin || '',
                        product_name: req.query.product_name || ''
                    })
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
                            amount: product.amount
                        }
                        brands.push(product.brand_name)
                        origins.push(product.product_origin)
                        productList.push(current_product)
                    })

                    brands = unique(brands)
                    origins = unique(origins)
                    return res.render('productManager', {
                        position: req.session.position,
                        products: productList,
                        brands,
                        origins,
                        current: page,
                        pages: Math.ceil(count / pageSize),
                        previous: previousPage,
                        next: nextPage,
                        lv1: req.query.lv1 || '',
                        lv2: req.query.lv2 || '',
                        lv3: req.query.lv3 || '',
                        brand: req.query.brand || '',
                        origin: req.query.origin || '',
                        product_name: req.query.product_name || ''
                    })
                }
            })
        })
    },
    findProductManager: (req, res, next) => {
        let page = req.query.page || 1
        page = parseInt(page)
        let pageSize = 20
        let skip = (page - 1) * pageSize
        let nextPage = page + 1;
        let previousPage = page <= 1 ? 1 : page - 1;

        const query = {
            product_origin: req.query.origin || "",
            brand_name: req.query.brand || ""
        }

        const classes = {
            lv1: req.query.lv1 || "0",
            lv2: req.query.lv2 || "0",
            lv3: req.query.lv3 || "0"
        }

        for (let x in query) {
            if (query[x] == "")
                delete query[`${x}`]
        }
        if (!req.query.lv2 && !req.query.lv3)
            return Products.find(query).skip(skip).limit(pageSize)
                .where('classes.lv1').equals(classes.lv1)
                .exec((err, products) => {
                    Products.countDocuments((err, count) => {
                        if (err) return next(err);

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
                                    amount: product.amount
                                }
                                brands.push(product.brand_name)
                                origins.push(product.product_origin)
                                productList.push(current_product)
                            })

                            brands = unique(brands)
                            origins = unique(origins)
                            return res.render('productManager', {
                                position: req.session.position,
                                products: productList,
                                brands,
                                origins,
                                current: page,
                                pages: Math.ceil(count / pageSize),
                                previous: previousPage,
                                next: nextPage,
                                lv1: req.query.lv1,
                                lv2: req.query.lv2,
                                lv3: req.query.lv3,
                                brand: req.query.brand,
                                origin: req.query.origin
                            })
                        }
                    })
                })
        else if (!req.query.lv3)
            return Products.find(query).skip(skip).limit(pageSize)
                .where('classes.lv1').equals(classes.lv1)
                .where('classes.lv2').equals(classes.lv2)
                .exec((err, products) => {
                    Products.countDocuments((err, count) => {
                        if (err) return next(err);

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
                                    amount: product.amount
                                }
                                brands.push(product.brand_name)
                                origins.push(product.product_origin)
                                productList.push(current_product)
                            })

                            brands = unique(brands)
                            origins = unique(origins)
                            return res.render('productManager', {
                                position: req.session.position,
                                products: productList,
                                brands,
                                origins,
                                current: page,
                                pages: Math.ceil(count / pageSize),
                                previous: previousPage,
                                next: nextPage,
                                lv1: req.query.lv1,
                                lv2: req.query.lv2,
                                lv3: req.query.lv3,
                                brand: req.query.brand,
                                origin: req.query.origin
                            })
                        }
                    })
                })
        else
            return Products.find(query).skip(skip).limit(pageSize)
                .where('classes.lv1').equals(classes.lv1)
                .where('classes.lv2').equals(classes.lv2)
                .where('classes.lv3').equals(classes.lv3)
                .exec((err, products) => {
                    Products.countDocuments((err, count) => {
                        if (err) return next(err);

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
                                    amount: product.amount
                                }
                                brands.push(product.brand_name)
                                origins.push(product.product_origin)
                                productList.push(current_product)
                            })

                            brands = unique(brands)
                            origins = unique(origins)
                            return res.render('productManager', {
                                position: req.session.position,
                                products: productList,
                                brands,
                                origins,
                                current: page,
                                pages: Math.ceil(count / pageSize),
                                previous: previousPage,
                                next: nextPage,
                                lv1: req.query.lv1,
                                lv2: req.query.lv2,
                                lv3: req.query.lv3,
                                brand: req.query.brand,
                                origin: req.query.origin
                            })
                        }
                    })
                })

    },
    getCreateOrder: (req, res, next) => {
        const sale = req.session.username || "";
        const error = req.flash('error') || "";
        const success = req.flash('success') || "";
        res.render('createOrders', { position: req.session.position, sale, error, success })
    },
    postCreateOrder: (req, res, next) => {
        const Customer = {
            fullname: req.query.fullname,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address,
        }
        const order = {
            Customer: Customer,
            sale: req.body.sale,
            total: req.body.total
        }

        return new Orders(order).save()
            .then(() => {
                return new Customers(Customer).save()
            })
            .then(() => {
                req.flash('success', 'Tạo đơn hàng thành công')
                return res.redirect('/admin/create-order')
            })
            .catch(err => {
                req.flash('error', 'Tạo đơn hàng thất bại ' + err)
                res.redirect('/admin/create-order')
            })

    },
    getAddNews: (req, res, next) => {
        const error = req.flash('error') || ""
        const success = req.flash('success') || ""
        res.render('addNews', { position: req.session.position, error, success })
    }
}

module.exports = AdminController