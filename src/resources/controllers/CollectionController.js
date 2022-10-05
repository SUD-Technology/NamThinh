const Products = require('../models/Products');

const menuItems = [
    // Lốp xe
    {
        title: 'Lốp xe Advance / Samson',
        src: 'Lop-xe-Advance-Samson-1',
        submenu: [
            {
                title: 'Lốp xe tải - xe khách',
                src: 'Lop-xe-tai-xe-khach-11',
                role: [
                    {
                        title: 'Lốp tải nhẹ',
                        src: 'Lop-tai-nhe-111',
                    },
                    {
                        title: 'Lốp tải nặng',
                        src: 'Lop-tai-nang-112',
                    },
                    {
                        title: 'Lốp xe khách - xe bus',
                        src: 'Lop-tai-nhe-113',
                    },

                ]
            },
            {
                title: 'Lốp máy công trình',
                src: 'Lop-may-cong-trinh-12',
                role: [
                    {
                        title: 'Lốp xe tải hạng nặng',
                        src: 'Lop-xe-tai-hang-nang-121'
                    },
                    {
                        title: 'Lốp máy xúc',
                        src: 'Lop-may-xuc-122'
                    },
                    {
                        title: 'Lốp xe cẩu',
                        src: 'Lop-xe-cau-123'
                    },
                    {
                        title: 'Lốp xe lu',
                        src: 'Lop-xe-lu-124'
                    },

                ]
            },
            {
                title: 'Lốp xe công nghiệp',
                src: 'Lop-xe-cong-nghiep-13',
                role: [
                    {
                        title: 'Lốp đặc',
                        src: 'Lop-dac-131'
                    },
                    {
                        title: 'Lốp công nghiệp khí nén',
                        src: 'Lop-cong-nghiep-khi-nen-132'
                    }
                ]
            },
            {
                title: 'Lốp xe nông nghiệp',
                src: 'Lop-xe-nong-nghiep-14',
                role: [
                    {
                        title: 'Lốp nông nghiệp nhỏ',
                        src: 'Lop-nong-nghiep-nho-141'
                    },
                    {
                        title: 'Lốp nông nghiệp lớn',
                        src: 'Lop-nong-nghiep-lon-142'
                    }
                ]
            }
        ]
    },
    // Xe tải
    {
        title: 'Xe tải - Đầu kéo - Xe ben',
        src: 'Xe-tai-dau-keo-xe-ben-2',
        submenu: [
            {
                title: 'Xe tải thùng',
                src: 'Xe-tai-thung-21'
            },
            {
                title: 'Xe đầu kéo',
                src: 'Xe-dau-keo-22'
            },
            {
                title: 'Xe ben',
                src: 'Xe-ben-23'
            },
            {
                title: 'Sơ mi rơ mooc',
                src: 'So-mi-ro-mooc-24'
            }
        ]
    },
    // Phụ tùng
    {
        title: 'Phụ tùng ô tô',
        src: 'Phu-tung-o-to-3',
        submenu: [
            {
                title: 'Phụ tùng xe tải thùng',
                src: 'Phu-tung-xe-tai-thung-31'
            },
            {
                title: 'Phụ tùng xe đầu kéo',
                src: 'Phu-tung-xe-dau-keo-32'
            },
            {
                title: 'Phụ tùng xe ben',
                src: 'Phu-tung-xe-ben-33'
            },
            {
                title: 'Phụ tùng sơ mi rơ mooc',
                src: 'Phu-tung-so-mi-ro-mooc-34'
            }
        ]
    },
    // Dầu nhớt
    {
        title: 'Dầu nhớt',
        src: 'Dau-nhot-4',
        submenu: [
            {
                title: 'Dầu nhớt ô tô - xe máy',
                src: 'Dau-nhot-o-to-xe-may-41',
                role: [
                    {
                        title: 'Dầu động cơ',
                        src: 'Dau-dong-co-411'
                    },
                    {
                        title: 'Dầu hộp số',
                        src: 'Dau-hop-so-412'
                    },
                    {
                        title: 'Dầu láp',
                        src: 'Dau-lap-413'
                    }
                ]
            },
            {
                title: 'Dầu nhớt công nghiệp',
                src: 'Dau-nhot-cong-nghiep-42',
                role: [
                    {
                        title: 'Dầu đa năng',
                        src: 'Dau-da-nang-421'
                    },
                    {
                        title: 'Dầu bôi trơn',
                        src: 'Dau-boi-tron-422'
                    },
                    {
                        title: 'Dầu thủy lực',
                        src: 'Dau-thuy-luc-423'
                    }
                ]
            }
        ]
    },
]

const CollectionController = {
    getACollection: (req, res, next) => {
        const slug = req.params.slug;
        const parts = slug.split('-');
        const signal = parts[parts.length - 1];
        const keys = signal.split('').map(el => {
            return parseInt(el - 1);
        });

        const level = keys.length;
        var submenu = menuItems[keys[0]].submenu;
        const page = parseInt(req.query.page) || 1;
        const view = req.query.view || '';
        const skip = view == 'home' ? 5 : 20;

        if (signal.includes(0) || level >= 4 || level <= 0 || keys[0] > 3) {
            const title = 'Không tồn tại';
            return res.render('collections', { title, msg: 'Không tìm thấy sản phẩm nào' });
        }

        if (level == 3) {
            const title = menuItems[keys[0]].submenu[keys[1]].role[keys[2]].title || "";
            if (!title) {
                return res.render('collections', { title, msg: 'Không tìm thấy sản phẩm nào' });
            }

            const level1 = {
                title: menuItems[keys[0]].title,
                src: menuItems[keys[0]].src
            }
            submenu = submenu[keys[1]].role;
            Products.find({})
                .select({description: 0})
                .sort({createdAt: -1})    
                .where('classes.lv1').equals(keys[0] + 1)
                .where('classes.lv2').equals(keys[1] + 1)
                .where('classes.lv3').equals(keys[2] + 1)
                .skip(skip * (page - 1)).limit(skip)
                .then(products => {
                    return handleProducts(req, res, view, level1, submenu, title, products, slug);
                })
                .catch(next)
        }

        if (level == 2) {
            const title = menuItems[keys[0]].submenu[keys[1]].title || "";
            if (!title) {
                return res.render('collections', { title, msg: 'Không tìm thấy sản phẩm nào' });
            }

            const level1 = {
                title: menuItems[keys[0]].title,
                src: menuItems[keys[0]].src
            }
            Products.find({})
                .select({description: 0})
                .sort({createdAt: -1})
                .where('classes.lv1').equals(keys[0] + 1)
                .where('classes.lv2').equals(keys[1] + 1)
                .skip(skip * (page - 1)).limit(skip)
                .then(products => {
                    return handleProducts(req, res, view, level1, submenu, title, products, slug);
                })
                .catch(next)

        }

        if (level == 1) {
            const title = menuItems[keys[0]].title || '';
            if (!title) {
                return res.render('collections', { title, msg: 'Không tìm thấy sản phẩm nào' });
            }

            const level1 = {
                title: menuItems[keys[0]].title,
                src: menuItems[keys[0]].src
            }
            Products.find({})
                .select({description: 0})
                .sort({createdAt: -1})
                .where('classes.lv1').equals(keys[0] + 1)
                .skip(skip * (page - 1))
                .limit(skip)
                .then(products => {
                    return handleProducts(req, res, view, level1, submenu, title, products, slug);
                })
                .catch(next)
        }

    },
    getFindProducts: (req, res, next) => {
        var keyword = req.query.key;

        const page = parseInt(req.query.page) || 1;
        let skip = 20 * (page - 1);

        Products
            .find({'$or': [{product_name: {$regex: keyword, $options: 'i'}},{product_model: {$regex: keyword, $options: 'i'} }]})
            .select({description: 0})
            .sort({createdAt: -1})
            .skip(skip).limit(20)
            .then(products => {
                if (products.length == 0) {
                    return res.render('search', {
                        title: 'Tìm sản phẩm',
                        msg: 'Không tìm thấy sản phẩm nào'
                    })
                }

                let data = products.map(product => {
                    return {
                        pname: product.product_name,
                        pslug: product.slug,
                        pimg: product.product_img[0],
                        pid: product.product_id,
                        brand: product.brand_name,
                        numPrice: product.price,
                        price: product.showPrice ? product.price.toLocaleString('vi', { style: 'currency', currency: 'VND' }) : 'Liên hệ'
                    }
                })

                return res.render('search', {
                    title: 'Tìm sản phẩm',
                    keyword,
                    data: data
                })
            })
    },
    postFindProducts: (req, res, next) => {
        var { keyword } = req.body;
        if (keyword) {
            return res.redirect(`/collections/search/?key=${keyword}`);
        }

        return res.redirect('/home');
    }


}


function handleProducts(req, res, view, level1, submenu, title, products, slug) {
    let brand_list = [];

    if (products.length == 0) {
        if (view == 'home') {
            return res.send(`<div class="  text-center h3"></div><div class=" text-center h3"></div><div class="d-flex justified-content-center text-center h5">Không tìm thấy sản phẩm</div>`);
        }
        return res.render('collections', { title, level1, submenu, slug, msg: 'Không tìm thấy sản phẩm nào' });
    }
    const data = products.map(product => {
        if (!brand_list.includes(product.brand_name))
            brand_list.push(product.brand_name);

        return {
            pname: product.product_name,
            pimg: product.product_img[0],
            pid: product.product_id,
            brand: product.brand_name,
            pslug: product.slug,
            numPrice: product.price,
            price: product.showPrice ? product.price.toLocaleString('vi', { style: 'currency', currency: 'VND' }) : 'Liên hệ',
            status: product.status,
        }
    })

    var html = '';
    let cart = 'Thêm vào giỏ';
    if (data.length > 0) {
        data.forEach((d, index) => {
            if (index == 5) return;
            let ico = d.status ? `<span class="ico-product ico-new"> ${d.status}</span>` : ''
            html += `
                <li class="items-product smooth text-center">
                    ${ico}
                    <div onclick='window.location.href="/products/${d.pslug}"' class="img-box">
                        <img class="img-product smooth" src="${d.pimg}"
                            alt="">
                    </div>

                    <div class="info-box">
                        <div class="items-title">
                            <a href="/products/${d.pslug}">${d.pname}</a>
                            <p>${d.pid}</p>
                        </div>
                        
                    </div>

                    <div onclick="addToShoppingCart('${d.pid}','${d.pname}','${d.pimg}','${d.pslug}','${d.numPrice}','${d.price}')" class="items-price">
                        ${d.price}
                    </div>
                    <div class="price-layer">${cart}</div>

                </li>
            `
        });
    } else {
        html += `<div>Không tìm thấy sản phẩm</div>`
    }

    if (view == 'home')
        return res.send(html);

    return res.render('collections', {
        title,
        level1,
        submenu,
        brand_list: brand_list.map((br, idx) => {
            return {
                id: idx + 1,
                name: br
            }
        }),
        data,
        slug,
        position: req.session.position
    });
}

module.exports = CollectionController;