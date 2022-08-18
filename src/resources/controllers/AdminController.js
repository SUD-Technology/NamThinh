const fs = require('fs')
const Products = require('../models/Products')
const slugify = require('slugify');
const path = require('path')
const Orders = require('../models/Orders')
const Customers = require('../models/Customers')
const Users = require('../models/Users')
const Posts = require('../models/Posts')
const Discounts = require('../models/Discounts')
const Services = require('../models/Services')
const moment = require('moment');
const About = require('../models/About');

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
        const { product_id, product_name, size, product_model, product_categories, product_branch, product_origin, product_description, product_amount, price, showPrice } = req.body
        let listImages = []
        if (!file) {
            res.json({ code: 1, message: "error" })
        } else {
            file.map(f => {
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
            inventory: product_amount,
            price: price,
            size: size,
            showPrice: showPrice,
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
                product.delete().then(res.redirect('/admin/product-manager'));
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
                            price: product.price.toLocaleString('vi', { style: 'currency', currency: 'VND' }),
                            model: product.product_model,
                            origin: product.product_origin,
                            amount: product.amount,
                            inventory: product.inventory,
                            size: product.size
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
        const { fullname, email, phone, address, sale, product_list, total } = req.body;

        Customers.findOne({ fullname: fullname, phone: phone, email: email })
            .then(customer => {
                let info = {
                    fullname: fullname,
                    email, phone, address
                }

                if (!customer) {
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
                            edit: req.session.username == order.sale
                        }
                        listOrders.push(current_order)
                    })
                    res.render('listOrders', {
                        listOrders,
                        layout: "admin",
                        pageName: "Danh sách đơn hàng",
                        position: req.session.position,
                    })
                } else {
                    res.render('listOrders', {
                        layout: "admin",
                        pageName: "Danh sách đơn hàng",
                        position: req.session.position,
                    })
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

        Orders.findOne({ _id: code })
            .then(order => {
                if (order) {
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
                            date: moment(order.complete.date).format('lll'),
                        }
                        listOrders.push(current_order)
                    })
                    res.render('history', { listOrders, layout: "admin", pageName: "Lịch sử giao dịch", position: req.session.position })
                } else {
                    res.render('history', { layout: "admin", pageName: "Lịch sử giao dịch", position: req.session.position })
                }
            })
    },
    finishOrder: (req, res, next) => {
        const { code, ops } = req.body;

        Orders.findOne({ _id: code })
            .then(order => {
                if (order) {
                    if (ops == 'accept') {
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
    },
    getAddDiscount: (req, res, next) => {
        const error = req.flash('error') || ""
        const success = req.flash('success') || ""
        res.render('addDiscount', { layout: 'admin', pageName: "Thêm Khuyến Mãi", position: req.session.position, error, success })
    },
    postAddDiscount: (req, res, next) => {
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
        const discount = {
            title: title,
            subtitle: subtitle,
            slug: slug,
            image: imagePath,
            content: content
        }

        return new Discounts(discount).save()
            .then(() => {
                req.flash('success', 'Thêm khuyến mãi thành công')
                res.redirect('/admin/add-discount')
            })
            .catch(() => {
                req.flash('error', 'Thêm khuyến mãi thất bại')
                res.redirect('/admin/add-discount')
            })
    },
    getAddServices: (req, res, next) => {
        const error = req.flash('error') || ""
        const success = req.flash('success') || ""
        res.render('addServices', { layout: 'admin', pageName: "Thêm Dịch Vụ", position: req.session.position, error, success })
    },
    postAddServices: (req, res, next) => {
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
        const service = {
            title: title,
            subtitle: subtitle,
            slug: slug,
            image: imagePath,
            content: content
        }

        return new Services(service).save()
            .then(() => {
                req.flash('success', 'Thêm dịch vụ thành công')
                res.redirect('/admin/add-services')
            })
            .catch(() => {
                req.flash('error', 'Thêm dịch vụ thất bại')
                res.redirect('/admin/add-services')
            })
    },
    deleteDiscount: (req, res, next) => {
        const id = req.params.id
        return Discounts.findByIdAndDelete(id)
            .then((dis) => {
                fs.unlink(`src/public/${dis.image}`, (err) => {
                    if (!err) {
                        req.flash('success', "Xóa chương trình khuyến mãi thành công")
                        res.redirect('/admin/listDiscounts')
                    } else {
                        req.flash('error', "Xóa chương trình khuyến mãi thất bại")
                        res.redirect('/admin/listDiscounts')
                    }
                })
            })
            .catch(() => {
                req.flash('error', "Xóa chương trình khuyến mãi thất bại")
                res.redirect('/admin/listDiscounts')
            })
    },
    deleteService: (req, res, next) => {
        const id = req.params.id
        return Services.findByIdAndDelete(id)
            .then((service) => {
                fs.unlink(`src/public/${service.image}`, (err) => {
                    if (!err) {
                        req.flash('success', "Xóa dịch vụ thành công")
                        res.redirect('/admin/listServices')
                    } else {
                        req.flash('error', "Xóa dịch vụ thất bại")
                        res.redirect('/admin/listServices')
                    }
                })
            })
            .catch(() => {
                req.flash('error', "Xóa dịch vụ thất bại")
                res.redirect('/admin/listServices')
            })
    },
    deletePosts: (req, res, next) => {
        const id = req.params.id
        return Posts.findByIdAndDelete(id)
            .then((post) => {
                fs.unlink(`src/public/${post.image}`, (err) => {
                    if (!err) {
                        req.flash('success', "Xóa bài viết thành công")
                        res.redirect('/admin/listNews')
                    } else {
                        req.flash('error', "Xóa bài viết thất bại")
                        res.redirect('/admin/listNews')
                    }
                })
            })
            .catch(() => {
                req.flash('error', "Xóa bài viết thất bại")
                res.redirect('/admin/listNews')
            })
    },
    getDiscounts: (req, res, next) => {
        Discounts.find()
            .then(discounts => {
                const data = discounts.map(item => {
                    return {
                        title: item.title,
                        id: item._id,
                        slug: item.slug,
                        createdAt: moment(item.createdAt).format('lll'),
                    }
                })

                return res.render('listDiscounts', {
                    data: data,
                    position: req.session.position,
                    layout: 'admin',
                    pageName: 'Danh sách khuyến mãi'
                })
            })
    },
    getServices: (req, res, next) => {
        Services.find()
            .then(services => {
                const data = services.map(item => {
                    return {
                        title: item.title,
                        id: item._id,
                        slug: item.slug,
                        createdAt: moment(item.createdAt).format('lll'),
                    }
                })

                return res.render('listServices', {
                    data: data,
                    position: req.session.position,
                    layout: 'admin',
                    pageName: 'Danh sách dịch vụ'
                })
            })
    },
    getPosts: (req, res, next) => {
        Posts.find()
            .then(posts => {
                const data = posts.map(item => {
                    return {
                        title: item.title,
                        id: item._id,
                        slug: item.slug,
                        createdAt: moment(item.createdAt).format('lll'),
                    }
                })

                return res.render('listPosts', {
                    data: data,
                    position: req.session.position,
                    layout: 'admin',
                    pageName: 'Danh sách tin tức'
                })
            })
    },
    getAddAbout: (req, res, next) => {
        const error = req.flash('error') || '';
        const success = req.flash('success') || '';

        res.render('addAbout', {
            layout: 'admin',
            pageName: 'Sửa nội dung giới thiệu'
            ,
            success, error
        });
    },
    postAddAbout: (req, res, next) => {
        const { content } = req.body;

        if (content) {
            About.findOne({})
                .then(about => {
                    about.content = content;
                    about.save();
                })
            req.flash('success', 'Sửa nội dung thành công');
            return res.redirect('/admin/add-about');
        }

        req.flash('error', 'Chưa nhập nội dung');
        return res.redirect('/admin/add-about')
    },
    getUpdateProduct: (req, res, next) => {

    },
    getUpdateDiscount: (req, res, next) => {
        const error = req.flash('error')
        const success = req.flash('success')
        const id = req.params.id
        return Discounts.findById(id)
            .then(discount => {
                const data = {
                    title: discount.title,
                    id: id,
                    content: discount.content,
                    subtitle: discount.subtitle,
                    image: discount.image
                }
                return res.render('update', {
                    data: data,
                    position: req.session.position,
                    layout: 'admin',
                    pageName: 'Chỉnh sửa thông tin khuyến mãi',
                    error,
                    success,
                    action: "/admin/updateDiscountById"
                })
            })
            .catch(err => {
                res.json({ err: err })
            })
    },
    getUpdateNews: (req, res, next) => {
        const error = req.flash('error')
        const success = req.flash('success')
        const id = req.params.id
        return Posts.findById(id)
            .then(post => {
                const data = {
                    title: post.title,
                    id: id,
                    content: post.content,
                    subtitle: post.subtitle,
                    image: post.image
                }
                return res.render('update', {
                    data: data,
                    position: req.session.position,
                    layout: 'admin',
                    pageName: 'Chỉnh sửa thông tin bải viết',
                    error,
                    success,
                    action: "/admin/updateNewsById"
                })
            })
            .catch(err => {
                res.json({ err: err })
            })
    },
    getUpdateService: (req, res, next) => {
        const error = req.flash('error')
        const success = req.flash('success')
        const id = req.params.id
        return Services.findById(id)
            .then(service => {
                const data = {
                    title: service.title,
                    id: id,
                    content: service.content,
                    subtitle: service.subtitle,
                    image: service.image
                }
                return res.render('update', {
                    data: data,
                    position: req.session.position,
                    layout: 'admin',
                    pageName: 'Chỉnh sửa thông tin dịch vụ',
                    error,
                    success,
                    action: "/admin/updateServiceById"
                })
            })
            .catch(err => {
                res.json({ err: err })
            })
    },
    postUpdateProduct: (req, res, next) => {
        const id = req.params.id;
        const { product_id, product_name, product_model, product_categories, product_branch, product_origin, product_description, product_amount } = req.body
    },
    postUpdateDiscount: (req, res, next) => {
        const { title, subtitle, content, old_image, id } = req.body
        let imagePath = old_image;
        if (req.file) {
            const file = req.file;
            imagePath = "/uploads/" + file.filename;
            fs.unlink(`src/public/${old_image}`, err => {
                if (err) {
                    req.flash('error', "Cập nhật khuyến mãi thất bại")
                    res.redirect(`/admin/updateDiscount/${id}`)
                }
            })
        }
        const slug = slugify(title, {
            replacement: '-',
            remove: false,
            lower: false,
            strict: false,
            locale: 'vi',
            trim: true
        })
        const discount = {
            title: title,
            subtitle: subtitle,
            slug: slug,
            image: imagePath,
            content: content
        }
        Discounts.findByIdAndUpdate(id, discount, (err, doc) => {
            if (!err) {
                req.flash('success', "Cập nhật khuyến mãi thành công")
                res.redirect(`/admin/updateDiscount/${id}`)
            } else {
                req.flash('error', "Cập nhật khuyến mãi thất bại")
                res.redirect(`/admin/updateDiscount/${id}`)
            }
        })
    },
    postUpdateNews: (req, res, next) => {
        const { title, subtitle, content, old_image, id } = req.body
        let imagePath = old_image;
        if (req.file) {
            const file = req.file;
            imagePath = "/uploads/" + file.filename;
            fs.unlink(`src/public/${old_image}`, err => {
                if (err) {
                    req.flash('error', "Cập nhật bài viết thất bại")
                    res.redirect(`/admin/updateNews/${id}`)
                }
            })
        }
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
        Posts.findByIdAndUpdate(id, post, (err, doc) => {
            if (!err) {
                req.flash('success', "Cập nhật bài viết thành công")
                res.redirect(`/admin/updateNews/${id}`)
            } else {
                req.flash('error', "Cập nhật bài viết thất bại")
                res.redirect(`/admin/updateNews/${id}`)
            }
        })
    },
    postUpdateService: (req, res, next) => {
        const { title, subtitle, content, old_image, id } = req.body
        let imagePath = old_image;
        if (req.file) {
            const file = req.file;
            imagePath = "/uploads/" + file.filename;
            fs.unlink(`src/public/${old_image}`, err => {
                if (err) {
                    req.flash('error', "Cập nhật dịch vụ thất bại")
                    res.redirect(`/admin/updateService/${id}`)

                }
            })
        }
        const slug = slugify(title, {
            replacement: '-',
            remove: false,
            lower: false,
            strict: false,
            locale: 'vi',
            trim: true
        })
        const services = {
            title: title,
            subtitle: subtitle,
            slug: slug,
            image: imagePath,
            content: content
        }
        Services.findByIdAndUpdate(id, services, (err, doc) => {
            if (!err) {
                req.flash('success', "Cập nhật dịch vụ thành công")
                res.redirect(`/admin/updateService/${id}`)
            } else {
                req.flash('error', "Cập nhật dịch vụ thất bại")
                res.redirect(`/admin/updateService/${id}`)
            }
        })
    }
}

module.exports = AdminController