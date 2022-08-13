const fs = require('fs')
const Products = require('../models/Products')
const slugify = require('slugify');
const path = require('path')
const Orders = require('../models/Orders')
const Customers = require('../models/Customers')
const Users = require('../models/Users')
const Posts = require('../models/Posts')
const { normalizeDate, normalizeDate_vi } = require('../middlewares/functions');

function unique(arr) {
    return Array.from(new Set(arr)) //
}

const AdminController = {
    getAddProduct: (req, res, next) => {
        const error = req.flash('error') || "";
        const success = req.flash('success') || ""
        // res.render('addProduct', { position: req.session.position, error, success })
        res.render('addProduct', { pageName: "Thêm sản phẩm", layout: 'admin', error, success, position: req.session.position })
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
                // let url = f.firebaseUrl.split('/').pop();
                let url = "/uploads/" + f.filename
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
                req.flash('success', 'Thêm sản phẩm thành công')
                res.redirect('/admin/add-product')
            })
            .catch((err) => {
                req.flash('error', 'Thêm sản phẩm thất bại')
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
                        layout: "admin",
                        pageName: "Danh sách sản phẩm",
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
                        layout: "admin",
                        pageName: "Danh sách sản phẩm",
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
                                layout: 'admin',
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
                                layout: 'admin',
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
                                layout: 'admin',
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
        res.render('createOrders', { layout: "admin", pageName: "Tạo đơn hàng", position: req.session.position, sale, error, success })
    },
    postCreateOrder: (req, res, next) => {
        const { fullname , email, phone, address, sale, product_list, total } = req.body;
        
        Customers.findOne({fullname: fullname, phone: phone, email: email})
            .then(customer => {
                let info = {
                    fullname: fullname,
                    email, phone, address
                }

                if(!customer) {      
                    new Customers(info).save();
                }

                let order = {
                    Customer: info,
                    sale: sale,
                    total: total,
                    product_list: product_list,
                }

                new Orders(order).save()
                    .then(() => {
                        req.flash('success', 'Tạo đơn hàng thành công')
                        return res.redirect('/admin/create-order')
                    })
                    .catch(err => {
                        req.flash('error', 'Tạo đơn hàng thất bại ' + err)
                        res.redirect('/admin/create-order')
                    })  
            })
            .catch(next);

    },
    getAddNews: (req, res, next) => {
        const error = req.flash('error') || ""
        const success = req.flash('success') || ""
        res.render('addNews', { layout: 'admin', pageName: "Đăng tin", position: req.session.position, error, success })
    },
    getUsers: (req, res, next) => {
        return Users.find({})
            .then(users => {
                let sales = []
                let accountants = []
                if (users.length > 0) {
                    users.forEach(user => {
                        const current_user = {
                            id: user._id,
                            name: user.fullname,
                            position: user.position,
                            email: user.email,
                            phone: user.phone,
                            username: user.username
                        }
                        if (user.position == 'sale')
                            sales.push(current_user)
                        else if (user.position == 'accountant')
                            accountants.push(current_user)
                    })
                    res.render('listUsers', { position: req.session.position, layout: 'admin', sales, accountants, pageName: "Thông tin nhân viên" })
                }
            })
    },
    deleteUser: (req, res, next) => {
        const id = req.params.id
        return Users.findByIdAndDelete(id)
            .then(() => {
                res.redirect('/admin/getUsers')
            })
            .catch(() => {
                res.json({ message: "Xóa tài khoản thất bại" })
            })
    },
    getCustomers: (req, res, next) => {
        let query
        if (req.query.keyWord) {
            if (!isNaN(parseInt(req.query.keyWord)))
                query = {
                    phone: { $regex: `${req.query.keyWord}`, "$options": "i" },
                }
            else {
                query = {
                    fullname: { $regex: `${req.query.keyWord}`, "$options": "i" },
                }
            }
        } else {
            query = {}
        }
        return Customers.find(query)
            .then(users => {
                var listCustomers = []
                if (users.length > 0) {
                    listCustomers = users.map(user => {
                        return {
                            fullname: user.fullname,
                            phone: user.phone,
                            email: user.email,
                            address: user.address
                        }
                    })        
                    return res.render('customerInfo', { position: req.session.position, listCustomers, layout: "admin", pageName: "Danh sách khách hàng", position: req.session.position, keyWord: req.query.keyWord })
                } else {
                    return res.render('customerInfo', { position: req.session.position, listCustomers, layout: "admin", pageName: "Danh sách khách hàng", position: req.session.position, keyWord: req.query.keyWord })
                }
            })
    },
    getOrders: (req, res, next) => {
        return Orders.find({})
            .where('complete.success').equals(null)
            .then(orders => {
                let listOrders = []
                if (orders.length > 0) {
                    orders.forEach(order => {
                        const customer = {
                            phone: order.Customer.phone,
                            name: order.Customer.fullname
                        }

                        const current_order = {
                            id: order._id,
                            customer: customer,
                            sale: order.sale,
                            total: order.total.toLocaleString('vi', { style: 'currency', currency: 'VND' }),
                            product_list: order.product_list,
                            status: order.status,
                        }
                        listOrders.push(current_order)
                    })
                    res.render('listOrders', { listOrders, layout: "admin", pageName: "Danh sách đơn hàng", position: req.session.position })
                }
            })
    },
    getOrderByCustomer: (req, res, next) => {
        const cid = req.params.cid
        return Orders.findById(cid)
            .then(order => {
                if (order) {
                    const customer = {
                        phone: order.Customer.phone,
                        name: order.Customer.fullname
                    }
                    const current_order = {
                        id: order._id,
                        customer: customer,
                        sale: order.sale,
                        total: order.total.toLocaleString('vi', { style: 'currency', currency: 'VND' }),
                        product_list: order.product_list
                    }
                    return res.render('listOrders', { current_order, layout: "admin", pageName: "Thông tin đơn hàng", position: req.session.position })
                }
                return res.render('listOrders', { current_order: {}, layout: "admin", pageName: "Thông tin đơn hàng", position: req.session.position })

            })
    },
    getCustomerByOrder: (req, res, next) => {
        const phone = req.params.phone
        return Customers.find({ phone: phone })
            .then(customer => {
                if (customer) {
                    const current_customer = {
                        id: customer._id,
                        phone: customer.phone,
                        address: customer.address,
                        name: customer.name,
                        status: customer.status
                    }
                    return res.render('listcustomers', { current_customer, layout: "admin", pageName: "Thông tin đơn hàng", position: req.session.position })
                }
                return res.render('listcustomers', { current_customer: {}, layout: "admin", pageName: "Thông tin đơn hàng", position: req.session.position })

            })
    },
    postANews: (req, res, next) => {
        const file = req.file;
        const imagePath = "/uploads/" + file.filename
        const { title, subtitle, content } = req.body
        const slug = slugify(title, {
            replacement: '-',
            remove: false,
            lower: false,
            strict: false,
            locale: 'vi',
            trim: true
        })
        const post = {
            title: title,
            subtitle: subtitle,
            slug: slug,
            image: imagePath,
            content: content
        }
        return new Posts(post).save()
            .then(() => {
                req.flash('success', 'Đăng tin thành công')
                res.redirect('/admin/add-news')
            })
            .catch(() => {
                req.flash('error', 'Đăng tin thất bại')
                res.redirect('/admin/add-news')
            })
    },
    postEditStatus: (req, res, next) => {
        const { status, code } = req.body;
        
        Orders.findOne({_id: code})
            .then(order => {
                if(order) {
                    order.status = status;
                    order.save()
                }
            })
    },
    getHistory: (req, res, next) => {
        return Orders.find({})
            .where('complete.success').ne(null)
            .then(orders => {
                let listOrders = []
                if (orders.length > 0) {
                    orders.forEach(order => {
                        const customer = {
                            phone: order.Customer.phone,
                            name: order.Customer.fullname
                        }

                        const current_order = {
                            id: order._id,
                            customer: customer,
                            sale: order.sale,
                            total: order.total.toLocaleString('vi', { style: 'currency', currency: 'VND' }),
                            product_list: order.product_list,
                            result: (order.complete.success) ? `<p style='color:#28a745'>Hoàn thành</p>` : `<p style='color:#dc3545'>Hủy bỏ</p>`,
                            date: normalizeDate_vi(order.complete.date),
                        }
                        listOrders.push(current_order)
                    })
                    res.render('history', { listOrders, layout: "admin", pageName: "Lịch sử giao dịch", position: req.session.position })
                }
            })
    },
    finishOrder: (req, res, next) => {
        const { code, ops } = req.body;

        Orders.findOne({_id: code})
            .then(order => {
                if(order) {
                    if(ops == 'accept') {
                        order.complete.success = true,
                        order.complete.date = new Date()
                        order.save();
                    }
                    else {
                        order.complete.success = false,
                        order.complete.date = new Date()
                        order.save();
                    }
                    
                }
            })
    }
}

module.exports = AdminController