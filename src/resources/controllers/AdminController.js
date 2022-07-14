const fs = require('fs')
const Products = require('../models/Products')
const slugify = require('slugify');

function unique(arr) {
    return Array.from(new Set(arr)) //
}

const AdminController = {
    addProduct: (req, res) => {
        const file = req.files
        const { product_id, product_name, product_model, product_categories, product_branch, product_origin, product_description } = req.body
        let listImages = []
        if (!file) {
            res.json({ code: 1, message: "error" })
        } else {
            let imaArray = file.map((file) => {
                let img = fs.readFileSync(file.path)
                return img.toString('base64')
            })
            imaArray.map((src, index) => {
                let finalImg = {
                    filename: file[index].originalname,
                    contentType: file[index].mimetype,
                    imageBase64: src
                }
                listImages.push(finalImg)
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
            main_img: listImages[0],
            description: product_description,
            product_model: product_model,
            product_origin: product_origin,
            brand_name: product_branch,
            classes: classes,
            slug: slug
        }

        return new Products(product).save()
            .then(() => {
                // res.json({ code: 1, message: "Thêm sản phẩm thành công" })
                res.redirect('/admin/add-product')
            })
            .catch((err) => {
                res.json({ code: 0, message: "Thêm sản phẩm thất bại", err: err })
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

    getProductManager: async (req, res, next) => {
        await Products.find({}).limit(10)
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
        // let productList = []
        // res.render('productManager', { admin: true, products: productList })
    }
}

module.exports = AdminController