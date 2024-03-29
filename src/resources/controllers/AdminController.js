const fs = require('fs');
const Products = require('../models/Products');
const slugify = require('slugify');
const path = require('path');
const Orders = require('../models/Orders');
const Customers = require('../models/Customers');
const Users = require('../models/Users');
const Posts = require('../models/Posts');
const Discounts = require('../models/Discounts');
const Services = require('../models/Services');
const Partners = require('../models/Partners');
const moment = require('moment');
const About = require('../models/About');
const Policy = require('../models/Policy');
const Recruit = require('../models/Recruits');
const ImageContent = require('../models/ImageContent');
const Recruits = require('../models/Recruits');
function unique(arr) {
    return Array.from(new Set(arr)); //
}

const AdminController = {
    // -------------------------------------------------------Products Section-----------------------------------------------------------//

    getAddProduct: (req, res, next) => {
        const error = req.flash('error') || '';
        const success = req.flash('success') || '';
        // res.render('addProduct', { position: req.session.position, error, success })
        res.render('addProduct', {
            pageName: 'Thêm sản phẩm',
            layout: 'admin',
            error,
            success,
            position: req.session.position,
        });
    },
    addProduct: (req, res) => {
        const file = req.files;

        const {
            product_id,
            product_name,
            product_model,
            size,
            product_categories,
            product_branch,
            product_origin,
            product_description,
            product_amount,
            price,
            showPrice,
        } = req.body;

        let listImages = [];
        if (!file) {
            res.json({ code: 1, message: 'error' });
        } else {
            file.map((f) => {
                let url = '/uploads/' + f.filename;
                listImages.push(url);
            });
        }
        const classes = {
            lv1: Number(product_categories[0]),
            lv2: Number(product_categories[1]),
            lv3: Number(product_categories[2]),
        };
        const slug = slugify(product_name + ' ' + product_id, {
            replacement: '-',
            remove: false,
            lower: false,
            strict: false,
            locale: 'vi',
            trim: true,
        });
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
            hot: '',
            classes: classes,
            slug: slug,
        };
        return new Products(product)
            .save()
            .then(() => {
                req.flash('success', 'Thêm sản phẩm thành công');
                res.redirect('/admin/add-product');
            })
            .catch((err) => {
                req.flash('error', 'Thêm sản phẩm thất bại ' + err);
                res.redirect('/admin/add-product');
            });
    },
    deleteProduct: (req, res, next) => {
        const id = req.params.id;
        return Products.findOne({ product_id: id })
            .then((product) => {
                if (product) {
                    product.delete();
                    fs.unlink(`source/src/public/${product.product_img}`, (err) => {
                        if (!err) {
                            req.flash('success', 'Xóa sản phẩm thành công');
                            res.redirect('/admin/productManager');
                        } else {
                            req.flash('error', 'Xóa sản phẩm thất bại');
                            res.redirect('/admin/productManager');
                        }
                    });
                }
            })
            .catch(() => {
                req.flash('error', 'Xóa sản phẩm thất bại');
                res.redirect('/admin/productManager');
            });
    },
    getProductManager: (req, res, next) => {
        let p_name = '';
        let query;
        if (req.query.product_name) {
            p_name = { $regex: `${req.query.product_name}`, $options: 'i' };
            query = {
                product_origin: req.query.origin || '',
                brand_name: req.query.brand || '',
                $or: [{ product_name: p_name }, { product_model: p_name }],
            };
        } else {
            query = {
                product_origin: req.query.origin || '',
                brand_name: req.query.brand || '',
            };
        }

        for (let x in query) {
            if (query[x] == '') delete query[`${x}`];
        }

        let level = {};

        if (!req.query.lv1 && !req.query.lv2 && !req.query.lv3) {
            level = {};
        } else if (!req.query.lv2 && !req.query.lv3) {
            query['classes.lv1'] = req.query.lv1;
        } else if (!req.query.lv3) {
            query['classes.lv1'] = req.query.lv1;
            query['classes.lv2'] = req.query.lv2;
        } else {
            query['classes.lv1'] = req.query.lv1;
            query['classes.lv2'] = req.query.lv2;
            query['classes.lv3'] = req.query.lv3;
        }

        let page = req.query.page || 1;
        page = parseInt(page);
        let pageSize = 20;
        let skip = (page - 1) * pageSize;
        let nextPage = page + 1;
        let previousPage = page <= 1 ? 1 : page - 1;
        return (
            Products.find(query)
                //return Products.find({ '$or': [query, { product_model: { $regex: `${req.query.product_model}`, $options: 'i' } }] })
                .select({ description: 0 })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(pageSize)
                .exec((err, products) => {
                    Products.countDocuments(query, (err, count) => {
                        if (err) return next(err);
                        if (products.length == 0) {
                            return res.render('productManager', {
                                layout: 'admin',
                                pageName: 'Danh sách sản phẩm',
                                position: req.session.position,
                                products: [],
                                current: 1,
                                pages: 1,
                                lv1: req.query.lv1 || '',
                                lv2: req.query.lv2 || '',
                                lv3: req.query.lv3 || '',
                                brand: req.query.brand || '',
                                origin: req.query.origin || '',
                                product_name: req.query.product_name || '',
                            });
                        } else {
                            let productList = [];
                            let brands = [];
                            let origins = [];
                            products.forEach((product) => {
                                const current_product = {
                                    id: product._id,
                                    pname: product.product_name,
                                    pimg: product.product_img[0],
                                    pid: product.product_id,
                                    pslug: product.slug,
                                    price: product.price.toLocaleString('vi', { style: 'currency', currency: 'VND' }),
                                    numPrice: product.price,
                                    model: product.product_model,
                                    origin: product.product_origin,
                                    amount: product.amount,
                                    inventory: product.inventory,
                                    size: product.size,
                                    position: req.session.position,
                                };
                                brands.push(product.brand_name);
                                origins.push(product.product_origin);
                                productList.push(current_product);
                            });

                            brands = unique(brands);
                            origins = unique(origins);
                            return res.render('productManager', {
                                layout: 'admin',
                                pageName: 'Danh sách sản phẩm',
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
                                product_name: req.query.product_name || '',
                            });
                        }
                    });
                })
        );
    },

    getUpdateProduct: (req, res, next) => {
        const error = req.flash('error');
        const success = req.flash('success');
        const id = req.params.id;
        return Products.findById(id)
            .then((product) => {
                const classes = `${product.classes.lv1}${product.classes.lv2}${product.classes.lv3}`;
                const data = {
                    name: product.product_name,
                    pid: product.product_id,
                    id: id,
                    desc: product.description,
                    brand: product.brand_name,
                    image: product.product_img,
                    model: product.product_model,
                    origin: product.product_origin,
                    price: product.price,
                    showPrice: product.showPrice || '',
                    amount: product.amount,
                    inventory: product.inventory,
                    size: product.size,
                    classes: classes,
                    status: product.status,
                    hot: product.hot || '',
                };
                return res.render('updateProduct', {
                    data: data,
                    position: req.session.position,
                    layout: 'admin',
                    pageName: 'Chỉnh sửa thông tin sản phẩm',
                    error,
                    success,
                    action: '/admin/updateProductById',
                });
            })
            .catch((err) => {
                res.json({ err: err });
            });
    },
    postUpdateProduct: (req, res, next) => {
        const {
            id,
            product_id,
            product_name,
            product_model,
            status,
            image,
            size,
            product_categories,
            product_branch,
            product_origin,
            product_description,
            product_amount,
            price,
            showPrice,
            hot,
        } = req.body;

        const listOldImages = image.split(',');
        let listImages = listOldImages;
        if (req.files.length != 0) {
            listImages = [];
            const file = req.files;
            listOldImages.forEach((item) => {
                fs.unlink(`source/src/public/${item}`, (err) => {
                    if (err) {
                        req.flash('error', 'Cập nhật thông tin sản phẩm thất bại');
                        return res.redirect(`/admin/updateProduct/${id}`);
                    }
                });
            });
            file.map((f) => {
                let url = '/uploads/' + f.filename;
                listImages.push(url);
            });
        }
        const classes = {
            lv1: Number(product_categories[0]),
            lv2: Number(product_categories[1]),
            lv3: Number(product_categories[2]),
        };
        const slug = slugify(product_name + ' ' + product_id, {
            replacement: '-',
            remove: false,
            lower: false,
            strict: false,
            locale: 'vi',
            trim: true,
        });
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
            showPrice: showPrice || '',
            hot: parseInt(hot) || '',
            classes: classes,
            slug: slug,
            status: status,
        };
        // res.json({ data: product })
        Products.findByIdAndUpdate(id, product, (err, doc) => {
            if (!err) {
                req.flash('success', 'Cập nhận thông tin sản phẩm thành công');
                res.redirect(`/admin/updateProduct/${id}`);
            } else {
                req.flash('error', 'Cập nhận thông tin sản phẩm thất bại ' + err);
                res.redirect(`/admin/updateProduct/${id}`);
            }
        });
    },

    // --------------------------------------------------------------END-----------------------------------------------------------------//

    // -------------------------------------------------------Orders Section-----------------------------------------------------------//

    getCreateOrder: (req, res, next) => {
        const sale = req.session.username || '';
        const error = req.flash('error') || '';
        const success = req.flash('success') || '';
        res.render('createOrders', {
            layout: 'admin',
            pageName: 'Tạo đơn hàng',
            position: req.session.position,
            sale,
            error,
            success,
        });
    },
    postCreateOrder: (req, res, next) => {
        const { fullname, email, phone, address, sale, total, product_list } = req.body;
        if (product_list == '[]') {
            req.flash('error', 'Vui lòng thêm sản phẩm vào giỏ');
            return res.redirect('/admin/create-order');
        }
        Customers.findOne({ fullname: fullname, phone: phone, email: email })
            .then((customer) => {
                let info = {
                    fullname: fullname,
                    email: email,
                    phone: phone,
                    address: address,
                };

                if (!customer) {
                    new Customers(info).save();
                }

                let order = {
                    Customer: info,
                    sale: sale,
                    total: total,
                    product_link: '',
                    product_list: product_list,
                };
                new Orders(order)
                    .save()
                    .then((order) => {
                        let id = order._id.toString();
                        order.product_link = `/admin/order/${id}`;
                        order.save();
                        req.flash('success', 'Tạo đơn hàng thành công');
                        return res.redirect('/admin/create-order');
                    })
                    .catch((err) => {
                        req.flash('error', 'Tạo đơn hàng thất bại ' + err);
                        res.redirect('/admin/create-order');
                    });
            })
            .catch(next);
    },
    getOrderDetail: async (req, res, next) => {
        const id = req.params.id;

        let listProduct = [];
        let customer = {};
        let order = await Orders.findById(id).then((order) => {
            JSON.parse(order.product_list).forEach((item) => {
                listProduct.push(JSON.parse(item));
            });

            customer.fullname = order.Customer.fullname;
            customer.email = order.Customer.email;
            customer.phone = order.Customer.phone;
            customer.address = order.Customer.address;

            return {
                product_list: listProduct,
                total: order.total.toLocaleString('vi', { style: 'currency', currency: 'VND' }),
            };
        });

        return res.render('orderDetail', {
            layout: 'admin',
            customer: customer,
            position: req.session.position,
            pageName: 'Chi tiết đơn hàng',
            data: order,
        });
    },
    getOrders: (req, res, next) => {
        const username = req.session.username;
        let query;
        if (username != 'admin') query = { sale: `${username}` };
        else query = {};
        return Orders.find({})
            .where('complete.success')
            .equals(null)
            .then((orders) => {
                let listOrders = [];
                if (orders.length > 0) {
                    orders.forEach((order) => {
                        const customer = {
                            phone: order.Customer.phone,
                            name: order.Customer.fullname,
                        };

                        let listProduct = [];
                        JSON.parse(order.product_list).forEach((item) => {
                            listProduct.push(JSON.parse(item));
                        });

                        const current_order = {
                            id: order._id,
                            customer: customer,
                            sale: order.sale,
                            total: order.total.toLocaleString('vi', { style: 'currency', currency: 'VND' }),
                            product_link: order.product_link,
                            status: order.status,
                            list: listProduct,
                            edit: req.session.username == order.sale || req.session.position == 'admin',
                        };
                        listOrders.push(current_order);
                    });
                    res.render('listOrders', {
                        listOrders,
                        layout: 'admin',
                        pageName: 'Danh sách đơn hàng',
                        position: req.session.position,
                    });
                } else {
                    res.render('listOrders', {
                        layout: 'admin',
                        pageName: 'Danh sách đơn hàng',
                        position: req.session.position,
                    });
                }
            });
    },
    getOrderByCustomer: (req, res, next) => {
        const cid = req.params.cid;
        return Orders.findById(cid).then((order) => {
            if (order) {
                const customer = {
                    phone: order.Customer.phone,
                    name: order.Customer.fullname,
                };
                const current_order = {
                    id: order._id,
                    customer: customer,
                    sale: order.sale,
                    total: order.total.toLocaleString('vi', { style: 'currency', currency: 'VND' }),
                    product_link: order.product_link,
                };
                return res.render('listOrders', {
                    current_order,
                    layout: 'admin',
                    pageName: 'Thông tin đơn hàng',
                    position: req.session.position,
                });
            }
            return res.render('listOrders', {
                current_order: {},
                layout: 'admin',
                pageName: 'Thông tin đơn hàng',
                position: req.session.position,
            });
        });
    },
    postEditStatus: (req, res, next) => {
        const { status, code } = req.body;

        Orders.findOne({ _id: code }).then((order) => {
            if (order) {
                order.status = status;
                order.save();
            }
        });
    },
    getHistory: (req, res, next) => {
        return Orders.find({})
            .where('complete.success')
            .ne(null)
            .then((orders) => {
                let listOrders = [];
                if (orders.length > 0) {
                    orders.forEach((order) => {
                        const customer = {
                            phone: order.Customer.phone,
                            name: order.Customer.fullname,
                        };
                        let listProduct = [];
                        JSON.parse(order.product_list).forEach((item) => {
                            listProduct.push(JSON.parse(item));
                        });
                        const current_order = {
                            id: order._id,
                            customer: customer,
                            sale: order.sale,
                            total: order.total.toLocaleString('vi', { style: 'currency', currency: 'VND' }),
                            product_link: order.product_link,
                            list: listProduct,
                            result: order.complete.success
                                ? `<p style='color:#28a745'>Hoàn thành</p>`
                                : `<p style='color:#dc3545'>Hủy bỏ</p>`,
                            date: moment(order.complete.date).format('lll'),
                        };
                        listOrders.push(current_order);
                    });
                    res.render('history', {
                        listOrders,
                        layout: 'admin',
                        pageName: 'Lịch sử giao dịch',
                        position: req.session.position,
                    });
                } else {
                    res.render('history', {
                        layout: 'admin',
                        pageName: 'Lịch sử giao dịch',
                        position: req.session.position,
                    });
                }
            });
    },
    finishOrder: (req, res, next) => {
        const { code, ops } = req.body;

        Orders.findOne({ _id: code }).then((order) => {
            if (order) {
                if (ops == 'accept') {
                    const listProduct = JSON.parse(order.product_list);

                    listProduct.forEach((item) => {
                        item = JSON.parse(item);
                        let newInventory = Number(item.inventory) - item.numberOfUnit;
                        Products.findOneAndUpdate(
                            { product_id: item.id },
                            { $set: { inventory: newInventory } },
                            (err, doc) => {
                                if (!err) {
                                    order.complete.success = true;
                                    order.complete.date = new Date();
                                    order.save();
                                } else {
                                    console.log(err);
                                }
                            },
                        );
                    });
                } else {
                    (order.complete.success = false), (order.complete.date = new Date());
                    order.save();
                }
            }
        });
    },
    getDetailOrder: (req, res, next) => {
        const id = req.params.id;
        return Orders.findOne({ _id: id }).then((order) => {
            if (order) {
                const customer = {
                    phone: order.Customer.phone,
                    name: order.Customer.fullname,
                    email: order.Customer.email,
                    address: order.Customer.address,
                };
                const current_order = {
                    id: order._id,
                    customer: customer,
                    sale: order.sale,
                    total: order.total,
                    product_link: order.product_link || '',
                    product_list: order.product_list || '',
                };
                return res.render('detailOrder', {
                    layout: 'admin',
                    pageName: 'Chi tiết đơn hàng',
                    position: req.session.position,
                });
            }
            return res.render('detailOrder', {
                data: {},
                layout: 'admin',
                pageName: 'Chi tiết đơn hàng',
                position: req.session.position,
            });
        });
    },

    // -------------------------------------------------------------END------------------------------------------------------------------//

    // ---------------------------------------------------------News Section-------------------------------------------------------------//
    getAddNews: (req, res, next) => {
        const error = req.flash('error') || '';
        const success = req.flash('success') || '';
        res.render('addNews', {
            layout: 'admin',
            pageName: 'Đăng tin',
            position: req.session.position,
            error,
            success,
        });
    },
    postANews: (req, res, next) => {
        const file = req.file;
        const imagePath = '/uploads/' + file.filename;
        const { title, subtitle, news_categories, content } = req.body;
        const slug = slugify(title, {
            replacement: '-',
            remove: false,
            lower: false,
            strict: false,
            locale: 'vi',
            trim: true,
        });
        let post = {
            title: title,
            subtitle: subtitle,
            slug: slug,
            group: news_categories || '',
            image: imagePath,
            content: content,
        };

        return ImageContent.find()
            .then((data) => {
                let list = [];
                if (data) {
                    data.forEach((item) => {
                        list.push(item.url);
                    });
                }
                post = {
                    ...post,
                    content_image: list,
                };
                Posts.create(post);
            })
            .then(() => {
                ImageContent.deleteMany({}, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.end('success');
                    }
                });
            })
            .then(() => {
                req.flash('success', 'Đăng tin thành công');
                res.redirect('/admin/add-news');
            })
            .catch(() => {
                req.flash('error', 'Đăng tin thất bại');
                res.redirect('/admin/add-news');
            });
    },
    deletePosts: (req, res, next) => {
        const id = req.params.id;
        return Posts.findByIdAndDelete(id)
            .then((post) => {
                let imageList = post.image;
                imageList.forEach((item) => {
                    fs.unlink(`source/src/public/${item}`, (err) => {
                        if (err) {
                            req.flash('error', 'Xóa bài viết thất bại');
                            res.redirect('/admin/listNews');
                        }
                    });
                });
                let imageContent = post.content_image;
                imageContent.forEach((item) => {
                    fs.unlink(`source/src/public/${item}`, (err) => {
                        if (err) {
                            req.flash('error', 'Xóa bài viết thất bại');
                            res.redirect('/admin/listNews');
                        }
                    });
                });
                req.flash('success', 'Xóa bài viết thành công');
                res.redirect('/admin/listNews');
            })
            .catch(() => {
                req.flash('error', 'Xóa bài viết thất bại');
                res.redirect('/admin/listNews');
            });
    },
    getPosts: (req, res, next) => {
        Posts.find()
            .select({ content: 0 })
            .then((posts) => {
                const data = posts.map((item) => {
                    return {
                        title: item.title,
                        id: item._id,
                        slug: item.slug,
                        createdAt: moment(item.createdAt).format('lll'),
                    };
                });

                return res.render('listPosts', {
                    data: data,
                    position: req.session.position,
                    layout: 'admin',
                    pageName: 'Danh sách tin tức',
                });
            });
    },
    getUpdateNews: (req, res, next) => {
        const error = req.flash('error');
        const success = req.flash('success');
        const id = req.params.id;
        return Posts.findById(id)
            .then((post) => {
                const data = {
                    title: post.title,
                    id: id,
                    content: post.content,
                    subtitle: post.subtitle,
                    image: post.image,
                };
                return res.render('update', {
                    data: data,
                    position: req.session.position,
                    layout: 'admin',
                    pageName: 'Chỉnh sửa thông tin bải viết',
                    error,
                    success,
                    prev: '/admin/listNews',
                    action: '/admin/updateNewsById',
                    hide: true,
                });
            })
            .catch((err) => {
                res.json({ err: err });
            });
    },
    postUpdateNews: (req, res, next) => {
        const { title, subtitle, content, old_image, id } = req.body;
        let imagePath = old_image;
        if (req.file) {
            const file = req.file;
            imagePath = '/uploads/' + file.filename;
            fs.unlink(`source/src/public/${old_image}`, (err) => {
                if (err) {
                    req.flash('error', 'Cập nhật bài viết thất bại');
                    res.redirect(`/admin/updateNews/${id}`);
                }
            });
        }
        const slug = slugify(title, {
            replacement: '-',
            remove: false,
            lower: false,
            strict: false,
            locale: 'vi',
            trim: true,
        });
        return Posts.findById(id)
            .then((post) => {
                let imageList = post.content_image;
                post.title = title;
                post.subtitle = subtitle;
                post.slug = slug;
                post.image = imagePath;
                post.content = content;
                ImageContent.find().then((data) => {
                    if (data) {
                        data.forEach((item) => {
                            imageList.push(item.url);
                        });
                    }
                    post.save();
                });
                ImageContent.deleteMany({}, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.end('success');
                    }
                });
                req.flash('success', 'Cập nhật bài viết thành công');
                res.redirect(`/admin/updateNews/${id}`);
            })
            .catch((err) => {
                req.flash('error', 'Cập nhật bài viết thất bại');
                res.redirect(`/admin/updateNews/${id}`);
            });
    },

    // --------------------------------------------------------------END-----------------------------------------------------------------//

    // -------------------------------------------------------Users Section-----------------------------------------------------------//

    getUsers: (req, res, next) => {
        return Users.find({}).then((users) => {
            let sales = [];
            let accountants = [];
            if (users.length > 0) {
                users.forEach((user) => {
                    const current_user = {
                        id: user._id,
                        name: user.fullname,
                        position: user.position,
                        email: user.email,
                        phone: user.phone,
                        username: user.username,
                    };
                    if (user.position == 'sale') sales.push(current_user);
                    else if (user.position == 'accountant') accountants.push(current_user);
                });
                res.render('listUsers', {
                    position: req.session.position,
                    layout: 'admin',
                    sales,
                    accountants,
                    pageName: 'Thông tin nhân viên',
                });
            }
        });
    },
    deleteUser: (req, res, next) => {
        const id = req.params.id;
        return Users.findByIdAndDelete(id)
            .then(() => {
                res.redirect('/admin/getUsers');
            })
            .catch(() => {
                res.json({ message: 'Xóa tài khoản thất bại' });
            });
    },

    // -----------------------------------------------------------END--------------------------------------------------------------------//

    // -------------------------------------------------------Customers Section-----------------------------------------------------------//

    getCustomers: (req, res, next) => {
        let query;
        if (req.query.keyWord) {
            if (!isNaN(parseInt(req.query.keyWord)))
                query = {
                    phone: { $regex: `${req.query.keyWord}`, $options: 'i' },
                };
            else {
                query = {
                    fullname: { $regex: `${req.query.keyWord}`, $options: 'i' },
                };
            }
        } else {
            query = {};
        }
        return Customers.find(query)
            .populate({ path: 'follower' })
            .lean()
            .then((users) => {
                var listCustomers = [];
            
                if (users.length > 0) {
                    listCustomers = users.map((user) => {
                        
                        return {
                            cid: user._id,
                            fullname: user.fullname,
                            phone: user.phone,
                            email: user.email,
                            address: user.address,
                            content: user.content,
                            follower: user.follower
                        };
                    });
                    return res.render('customerInfo', {
                        success: req.flash('success'),
                        error: req.flash('error'),
                        uid: req.session.uid,
                        position: req.session.position,
                        listCustomers,
                        layout: 'admin',
                        pageName: 'Danh sách khách hàng',
                        position: req.session.position,
                        keyWord: req.query.keyWord,
                    });
                } else {
                    return res.render('customerInfo', {
                        success: req.flash('success'),
                        error: req.flash('error'),
                        uid: req.session.uid,
                        position: req.session.position,
                        listCustomers,
                        layout: 'admin',
                        pageName: 'Danh sách khách hàng',
                        position: req.session.position,
                        keyWord: req.query.keyWord,
                    });
                }
            });
    },
    getCustomerByOrder: (req, res, next) => {
        const phone = req.params.phone;
        return Customers.find({ phone: phone }).then((customer) => {
            if (customer) {
                const current_customer = {
                    id: customer._id,
                    phone: customer.phone,
                    address: customer.address,
                    name: customer.name,
                    status: customer.status,
                };
                return res.render('listcustomers', {
                    current_customer,
                    layout: 'admin',
                    pageName: 'Thông tin đơn hàng',
                    position: req.session.position,
                });
            }
            return res.render('listcustomers', {
                current_customer: {},
                layout: 'admin',
                pageName: 'Thông tin đơn hàng',
                position: req.session.position,
            });
        });
    },

    // -----------------------------------------------------------END--------------------------------------------------------------------//

    // -------------------------------------------------------About Section-----------------------------------------------------------//

    getAddAbout: (req, res, next) => {
        const error = req.flash('error') || '';
        const success = req.flash('success') || '';
        About.findOne({}).then((about) => {
            const content = about.content;
            res.render('addAbout', {
                layout: 'admin',
                pageName: 'Sửa nội dung giới thiệu',
                content,
                success,
                error,
                position: req.session.position,
            });
        });
    },
    postAddAbout: (req, res, next) => {
        const { content } = req.body;

        if (content) {
            About.findOne({}).then((about) => {
                about.content = content;
                about.save();
            });
            req.flash('success', 'Sửa nội dung thành công');
            return res.redirect('/admin/add-about');
        }

        req.flash('error', 'Chưa nhập nội dung');
        return res.redirect('/admin/add-about');
    },

    // -----------------------------------------------------------END--------------------------------------------------------------------//

    // -------------------------------------------------------Discounts Section-----------------------------------------------------------//

    getAddDiscount: (req, res, next) => {
        const error = req.flash('error') || '';
        const success = req.flash('success') || '';
        res.render('addDiscount', {
            layout: 'admin',
            pageName: 'Thêm Khuyến Mãi',
            position: req.session.position,
            error,
            success,
        });
    },
    postAddDiscount: (req, res, next) => {
        const file = req.file;
        const imagePath = '/uploads/' + file.filename;
        const { title, subtitle, expire, content } = req.body;
        const slug = slugify(title, {
            replacement: '-',
            remove: false,
            lower: false,
            strict: false,
            locale: 'vi',
            trim: true,
        });
        let discount = {
            title: title,
            subtitle: subtitle,
            slug: slug,
            image: imagePath,
            expire: new Date(expire),
            content: content,
        };

        return ImageContent.find()
            .then((data) => {
                let list = [];
                if (data) {
                    data.forEach((item) => {
                        list.push(item.url);
                    });
                }
                discount = {
                    ...discount,
                    content_image: list,
                };
                Discounts.create(discount);
            })
            .then(() => {
                ImageContent.deleteMany({}, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.end('success');
                    }
                });
            })
            .then(() => {
                req.flash('success', 'Thêm khuyến mãi thành công');
                res.redirect('/admin/add-discount');
            })
            .catch(() => {
                req.flash('error', 'Thêm khuyến mãi thất bại');
                res.redirect('/admin/add-discount');
            });
    },
    deleteDiscount: (req, res, next) => {
        const id = req.params.id;
        return Discounts.findByIdAndDelete(id)
            .then((dis) => {
                fs.unlink(`source/src/public/${dis.image}`, (err) => {
                    if (!err) {
                        req.flash('success', 'Xóa chương trình khuyến mãi thành công');
                        res.redirect('/admin/listDiscounts');
                    } else {
                        req.flash('error', 'Xóa chương trình khuyến mãi thất bại');
                        res.redirect('/admin/listDiscounts');
                    }
                });

                let imageContent = dis.content_image;
                imageContent.forEach((item) => {
                    fs.unlink(`source/src/public/${item}`, (err) => {
                        if (err) {
                            req.flash('success', 'Xóa chương trình khuyến mãi thành công');
                            return res.redirect('/admin/listDiscounts');
                        } else {
                            req.flash('error', 'Xóa chương trình khuyến mãi thất bại');
                            return res.redirect('/admin/listDiscounts');
                        }
                    });
                });
            })
            .catch(() => {
                req.flash('error', 'Xóa chương trình khuyến mãi thất bại');
                res.redirect('/admin/listDiscounts');
            });
    },
    getDiscounts: (req, res, next) => {
        Discounts.find()
            .sort({ createdAt: -1 })
            .then((discounts) => {
                const data = discounts.map((item) => {
                    return {
                        title: item.title,
                        id: item._id,
                        slug: item.slug,
                        createdAt: moment(item.createdAt).format('lll'),
                    };
                });

                return res.render('listDiscounts', {
                    data: data,
                    position: req.session.position,
                    layout: 'admin',
                    pageName: 'Danh sách khuyến mãi',
                });
            });
    },
    getUpdateDiscount: (req, res, next) => {
        const error = req.flash('error');
        const success = req.flash('success');
        const id = req.params.id;
        return Discounts.findById(id)
            .then((discount) => {
                let current = discount.expire.toLocaleDateString().split('/');
                let expire = current[2] + '-' + current[0] + '-' + current[1];
                const data = {
                    title: discount.title,
                    id: id,
                    content: discount.content,
                    subtitle: discount.subtitle,
                    image: discount.image,
                    expire: expire,
                };

                // console.log(data);
                return res.render('update', {
                    data: data,
                    position: req.session.position,
                    layout: 'admin',
                    pageName: 'Chỉnh sửa thông tin khuyến mãi',
                    error,
                    success,
                    prev: '/admin/listDiscounts',
                    action: '/admin/updateDiscountById',
                });
            })
            .catch((err) => {
                res.json({ err: err });
            });
    },
    postUpdateDiscount: async (req, res, next) => {
        const { title, subtitle, expire, content, old_image, id } = req.body;
        let imagePath = old_image;
        if (req.file) {
            const file = req.file;
            imagePath = '/uploads/' + file.filename;
            fs.unlink(`source/src/public/${old_image}`, (err) => {
                if (err) {
                    req.flash('error', 'Cập nhật khuyến mãi thất bại ' + err);
                    res.redirect(`/admin/updateDiscount/${id}`);
                }
            });
        }
        const slug = slugify(title, {
            replacement: '-',
            remove: false,
            lower: false,
            strict: false,
            locale: 'vi',
            trim: true,
        });
        return Discounts.findById(id)
            .then(async (discount) => {
                let imageList = discount.content_image;
                discount.title = title;
                discount.subtitle = subtitle;
                discount.slug = slug;
                discount.image = imagePath;
                discount.content = content;
                discount.expire = expire;
                await ImageContent.find().then((data) => {
                    if (data) {
                        data.forEach((item) => {
                            imageList.push(item.url);
                        });
                    }
                    discount.save();
                });
                ImageContent.deleteMany({}, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.end('success');
                    }
                });
                req.flash('success', 'Cập nhật khuyến mãi thành công');
                res.redirect(`/admin/updateDiscount/${id}`);
            })
            .catch((err) => {
                req.flash('error', 'Cập nhật khuyến mãi thất bại');
                res.redirect(`/admin/updateDiscount/${id}`);
            });
    },

    // -----------------------------------------------------------------END--------------------------------------------------------------//

    // -------------------------------------------------------Services Section-----------------------------------------------------------//

    getAddServices: (req, res, next) => {
        const error = req.flash('error') || '';
        const success = req.flash('success') || '';
        res.render('addServices', {
            layout: 'admin',
            pageName: 'Thêm Dịch Vụ',
            position: req.session.position,
            error,
            success,
        });
    },
    postAddServices: (req, res, next) => {
        const file = req.file;
        const imagePath = '/uploads/' + file.filename;
        const { title, subtitle, category, content } = req.body;
        const slug = slugify(title, {
            replacement: '-',
            remove: false,
            lower: false,
            strict: false,
            locale: 'vi',
            trim: true,
        });
        let service = {
            title: title,
            subtitle: subtitle,
            category: category,
            slug: slug,
            image: imagePath,
            content: content,
        };

        return ImageContent.find()
            .then((data) => {
                let list = [];
                if (data) {
                    data.forEach((item) => {
                        list.push(item.url);
                    });
                }
                service = {
                    ...service,
                    content_image: list,
                };
                Services.create(service);
            })
            .then(() => {
                ImageContent.deleteMany({}, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.end('success');
                    }
                });
            })
            .then(() => {
                req.flash('success', 'Thêm dịch vụ thành công');
                res.redirect('/admin/add-services');
            })
            .catch(() => {
                req.flash('error', 'Thêm dịch vụ thất bại');
                res.redirect('/admin/add-services');
            });
    },
    deleteService: (req, res, next) => {
        const id = req.params.id;
        return Services.findByIdAndDelete(id)
            .then((service) => {
                let imageContent = service.content_image;
                imageContent.forEach((item) => {
                    fs.unlink(`source/src/public/${item}`, (err) => {
                        if (err) {
                            req.flash('success', 'Xóa dịch vụ thành công');
                            res.redirect('/admin/listServices');
                        } else {
                            req.flash('error', 'Xóa dịch vụ thất bại');
                            res.redirect('/admin/listServices');
                        }
                    });
                });
                fs.unlink(`source/src/public/${service.image}`, (err) => {
                    if (!err) {
                        req.flash('success', 'Xóa dịch vụ thành công');
                        res.redirect('/admin/listServices');
                    } else {
                        req.flash('error', 'Xóa dịch vụ thất bại');
                        res.redirect('/admin/listServices');
                    }
                });
            })
            .catch(() => {
                req.flash('error', 'Xóa dịch vụ thất bại');
                res.redirect('/admin/listServices');
            });
    },
    getServices: (req, res, next) => {
        Services.find()
            .select({ content: 0 })
            .then((services) => {
                const data = services.map((item) => {
                    return {
                        title: item.title,
                        id: item._id,
                        slug: item.slug,
                        createdAt: moment(item.createdAt).format('lll'),
                    };
                });

                return res.render('listServices', {
                    data: data,
                    position: req.session.position,
                    layout: 'admin',
                    pageName: 'Danh sách dịch vụ',
                });
            });
    },
    getUpdateService: (req, res, next) => {
        const error = req.flash('error') || '';
        const success = req.flash('success') || '';
        const id = req.params.id;
        return Services.findById(id)
            .then((service) => {
                const data = {
                    title: service.title,
                    id: id,
                    content: service.content,
                    subtitle: service.subtitle,
                    image: service.image,
                };
                return res.render('update', {
                    data: data,
                    position: req.session.position,
                    layout: 'admin',
                    pageName: 'Chỉnh sửa thông tin dịch vụ',
                    error,
                    success,
                    prev: '/admin/listServices',
                    action: '/admin/updateServiceById',
                    hide: true,
                });
            })
            .catch((err) => {
                return res.json({ err: err });
            });
    },
    postUpdateService: (req, res, next) => {
        const { title, subtitle, content, old_image, id } = req.body;
        let imagePath = old_image;
        if (req.file) {
            const file = req.file;
            imagePath = '/uploads/' + file.filename;
            fs.unlink(`source/src/public/${old_image}`, (err) => {
                if (err) {
                    req.flash('error', 'Cập nhật dịch vụ thất bại');
                    return res.redirect(`/admin/updateService/${id}`);
                }
            });
        }
        const slug = slugify(title, {
            replacement: '-',
            remove: false,
            lower: false,
            strict: false,
            locale: 'vi',
            trim: true,
        });
        return Services.findById(id)
            .then((service) => {
                let imageList = service.content_image;
                service.title = title;
                service.subtitle = subtitle;
                service.slug = slug;
                service.image = imagePath;
                service.content = content;
                ImageContent.find().then((data) => {
                    if (data) {
                        data.forEach((item) => {
                            imageList.push(item.url);
                        });
                    }
                    service.save();
                });
                ImageContent.deleteMany({}, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.end('success');
                    }
                });
                req.flash('success', 'Cập nhật dịch vụ thành công');
                res.redirect(`/admin/updateService/${id}`);
            })
            .catch((err) => {
                req.flash('error', 'Cập nhật dịch vụ thất bại');
                res.redirect(`/admin/updateService/${id}`);
            });
    },

    // -----------------------------------------------------------------END--------------------------------------------------------------//

    // -----------------------------------------------------------Partners Section--------------------------------------------------------------------//

    getAddPartner: (req, res, next) => {
        const error = req.flash('error') || '';
        const success = req.flash('success') || '';

        return res.render('addPartner', {
            layout: 'admin',
            position: req.session.position,
            pageName: 'Thêm đối tác',
            error,
            success,
        });
    },
    postAddPartner: (req, res, next) => {
        const file = req.file;
        const imagePath = '/uploads/' + file.filename;
        const { partner_name } = req.body;

        if (!partner_name || !file) {
            req.flash('error', 'Nhập đầy đủ thông tin trước thi thêm');
            return res.redirect('/admin/addPartner');
        }

        const partner = {
            partner_name: partner_name,
            image: imagePath,
        };

        new Partners(partner).save();
        req.flash('success', 'Thêm đối tác thành công');
        return res.redirect('/admin/addPartner');
    },
    getPartners: (req, res, next) => {
        const error = req.flash('error') || '';
        const success = req.flash('success') || '';

        Partners.find({}).then((partners) => {
            const data = partners.map((partner) => {
                return {
                    id: partner._id,
                    name: partner.partner_name,
                    image: partner.image,
                };
            });

            return res.render('listPartners', {
                layout: 'admin',
                pageName: 'Danh sách đối tác',
                position: req.session.position,
                data,
                error,
                success,
            });
        });
    },
    getDeletePartner: (req, res, next) => {
        const id = req.params.id;
        return Partners.findByIdAndDelete(id)
            .then((partner) => {
                fs.unlink(`source/src/public/${partner.image}`, (err) => {
                    if (!err) {
                        req.flash('success', 'Xóa đối tác thành công');
                        res.redirect('/admin/listPartners');
                    } else {
                        req.flash('error', 'Xóa đối tác thất bại');
                        res.redirect('/admin/listPartners');
                    }
                });
            })
            .catch(() => {
                req.flash('error', 'Xóa đối tác thất bại');
                res.redirect('/admin/listPartners');
            });
    },
    getUpdateIndex: (req, res, next) => {
        const error = req.flash('error') || '';
        const success = req.flash('success') || '';

        return res.render('updateIndex', {
            success,
            error,
            layout: 'admin',
            position: req.session.position,
        });
    },
    postUpdateIndex: (req, res, next) => {
        const file = req.file;
        // const imagePath = "/uploads/Wel/" + file.filename

        if (!file) {
            req.flash('error', 'Vui lòng thêm ảnh');
            return res.redirect('/admin/updateIndex');
        }

        req.flash('success', 'Thay đổi ảnh thành công');
        return res.redirect('/admin/updateIndex');
    },

    // -----------------------------------------------------------------END--------------------------------------------------------------//

    // -----------------------------------------------------------Policy Section--------------------------------------------------------------------//

    getUpdatePolicy: (req, res, next) => {
        const error = req.flash('error') || '';
        const success = req.flash('success') || '';
        const slug = req.params.slug;

        return Policy.findOne({ slug: slug })
            .then((policy) => {
                const data = {
                    id: policy._id,
                    name: policy.name,
                    content: policy.content,
                    slug: policy.slug,
                };

                return res.render('updatePolicy', {
                    layout: 'admin',
                    position: req.session.position,
                    action: `/admin/updatePolicy`,
                    error,
                    success,
                    data,
                });
            })
            .catch(next);
    },
    postUpdatePolicy: (req, res, next) => {
        const { name, id, content, slug } = req.body;

        if (!content) {
            req.flash('error', 'Vui lòng nhập nội dung');
            return res.redirect(`/admin/updatePolicy/${slug}`);
        }

        let newP = {
            name,
            content,
            slug,
        };

        return Policy.findByIdAndUpdate(id, newP, (err, doc) => {
            if (!err) {
                req.flash('success', 'Cập nhật chính sách thành công');
                return res.redirect(`/admin/updatePolicy/${slug}`);
            } else {
                req.flash('error', 'Cập nhật chính sách thất bại');
                return res.redirect(`/admin/updatePolicy/${slug}`);
            }
        });
    },

    // -----------------------------------------------------------------END--------------------------------------------------------------//

    // -----------------------------------------------------------Recuir Section--------------------------------------------------------------------//

    getAddRecruit: (req, res, next) => {
        const error = req.flash('error') || '';
        const success = req.flash('success') || '';

        return res.render('addRecruit', {
            layout: 'admin',
            action: '/admin/addRecruit',
            position: req.session.position,
            pageName: 'Thêm tuyển dụng',
            error,
            success,
        });
    },
    postAddRecruit: async (req, res, next) => {
        const file = req.file;
        if (!file) {
            req.flash('error', 'Vui lòng chọn hình ảnh');
            return res.redirect('/admin/addRecruit');
        }

        const { position, location, salary, content } = req.body;
        const slug = slugify(position, {
            replacement: '-',
            remove: false,
            lower: false,
            strict: false,
            locale: 'vi',
            trim: true,
        });

        const recruit = {
            position,
            location,
            salary,
            slug,
            content,
            image: `/uploads/${file.filename}`,
        };

        await new Recruit(recruit).save();
        req.flash('success', 'Thêm tuyển dụng thành công');
        return res.redirect('/admin/addRecruit');
    },
    getDeleteRecruit: async (req, res, next) => {
        const id = req.params.id;

        await Recruit.findByIdAndDelete(id)
            .then((product) => {
                fs.unlink(`source/src/public/${product.image}`, (err) => {
                    //...
                });
                req.flash('success', 'Xóa tuyển dụng thành công');
                return res.redirect('/admin/recruitManager');
            })
            .catch((err) => {
                req.flash('error', 'Xóa tuyển dụng thất bại - Error: ' + err);
                return res.redirect('/admin/recruitManager');
            });
    },
    getUpdateRecruit: async (req, res, next) => {
        const error = req.flash('error') || '';
        const success = req.flash('success') || '';

        const id = req.params.id;

        let recruit = await Recruit.findById(id).then((result) => {
            return {
                id: result._id.toString(),
                position: result.position,
                location: result.location,
                salary: result.salary,
                image: result.image,
                content: result.content,
            };
        });
        return res.render('updateRecruit', {
            data: recruit,
            layout: 'admin',
            action: '/admin/updateRecruit',
            pageName: 'Chỉnh sửa tuyển dụng',
            position: req.session.position,
            error,
            success,
        });
    },
    postUpdateRecruit: async (req, res, next) => {
        const file = req.file;
        const { id, position, location, salary, content, old_image } = req.body;

        let recruit = {
            position,
            location,
            salary,
            content,
            image: '',
        };

        if (!file) {
            recruit.image = old_image;
            await Recruit.findByIdAndUpdate(id, { $set: recruit })
                .then((product) => {
                    req.flash('success', 'Chỉnh sửa tuyển dụng thành công');
                    return res.redirect(`/admin/updateRecruit/${id}`);
                })
                .catch((err) => {
                    req.flash('error', 'Chỉnh sửa tuyển dụng thất bại - Error: ' + err);
                    return res.redirect(`/admin/updateRecruit/${id}`);
                });
        } else {
            recruit.image = `/uploads/${file.filename}`;

            await Recruit.findByIdAndUpdate(id, { $set: recruit })
                .then((product) => {
                    fs.unlink(`source/src/public/${old_image}`, (err) => {
                        console.log('deleted old image');
                    });
                    req.flash('success', 'Chỉnh sửa tuyển dụng thành công');
                    return res.redirect(`/admin/updateRecruit/${id}`);
                })
                .catch((err) => {
                    fs.unlink(`source/src/public/uploads/${file.filename}`);
                    req.flash('error', 'Chỉnh sửa tuyển dụng thất bại - Error: ' + err);
                    return res.redirect(`/admin/updateRecruit/${id}`);
                });
        }
    },

    getRecruitManager: async (req, res, next) => {
        const error = req.flash('error') || '';
        const success = req.flash('success') || '';

        let recruits = await Recruit.find({})
            .select({ content: 0 })
            .sort({ updatedAt: -1 })
            .then((results) => {
                return results.map((r) => {
                    return {
                        _id: r._id.toString(),
                        position: r.position,
                        createdAt: r.updatedAt.toLocaleString('vi-vn'),
                        slug: r.slug,
                    };
                });
            });

        return res.render('recruitManager', {
            pageName: 'Danh sách tuyển dụng',
            layout: 'admin',
            position: req.session.position,
            data: recruits,
            success,
            error,
        });
    },

    // -----------------------------------------------------------------END-------------------------------------------------------------------//
};

module.exports = AdminController;
