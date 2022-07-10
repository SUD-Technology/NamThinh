const Collections = require('../models/Collections');
const Products = require('../models/Products');

const menuItems = [
    // Lốp xe
    {
        title: 'Lốp xe Advance / Samson',
        submenu: [
            {
                title: 'Lốp xe tải - xe khách',
                role: [
                    'Lốp tải nhẹ',
                    'Lốp tải nặng',
                    'Lốp xe khách - xe bus'
                ]
            },
            {
                title: 'Lốp máy công trình',
                role: [
                    'Lốp xe tải hạng nặng',
                    'Lốp máy xúc',
                    'Lốp xe cẩu',
                    'Lốp xe lu'
                ]
            },
            {
                title: 'Lốp xe công nghiệp',
                role: [
                    'Lốp đặc',
                    'Lốp công nghiệp khí nén',     
                ]
            },
            {
                title: 'Lốp nông nghiệp',
                role: [
                    'Lốp nông nghiệp nhỏ',
                    'Lốp nông nghiệp lớn',
                ]
            }
        ]
    },
    // Xe tải
    {
        title: 'Xe tải - Đầu kéo - Xe ben',
        submenu: [
            {
                title: 'Xe tải thùng',
            },
            {
                title: 'Xe đầu kéo',
            },
            {
                title: 'Xe ben',
            },
            {
                title: 'Sơ mi rơ mooc',
            }
        ]
    },
    // Phụ tùng
    {
        title: 'Phụ tùng ô tô',
        submenu: [
            {
                title: 'Xe tải thùng',
            },
            {
                title: 'Xe đầu kéo',
            },
            {
                title: 'Xe ben',
            },
            {
                title: 'Sơ mi rơ mooc',
            }
        ]
    },
    // Dầu nhớt
    {
        title: 'Dầu nhớt',
        submenu: [
            {
                title: 'Dầu nhớt ô tô - xe máy',
                role: [
                    'Dầu động cơ',
                    'Dầu hộp số',
                    'Dầu láp'
                ]
            },
            {
                title: 'Dầu nhớt công nghiệp',
                role: [
                    'Dầu đa năng',
                    'Dầu bôi trơn',
                    'Dầu thủy lực'
                ]
            }
        ]
    },
]

const CollectionController = {
    getACollection: (req, res, next) => {
        const parts = (req.params.slug).split('-');
        const signal = parts[parts.length - 1];
        const keys = signal.split('').map(el => {
            return parseInt(el - 1);
        });
        
        const level = keys.length;
        
        if(signal.includes(0) ||  level >= 4 || level <= 0) {
            return res.json({success: false, msg: 'Không tìm thầy sản phẩm nào'});
        }
        
        if(level == 3) {
            const title = menuItems[keys[0]].submenu[keys[1]].role[keys[2]] || "";
            if(!title) {
                return res.json({success: false, msg: 'Không tìm thầy sản phẩm nào'});
            }
            
            Products.find({})
                .where('classes.lv1').equals(keys[0] + 1)
                .where('classes.lv2').equals(keys[1] + 1)
                .where('classes.lv3').equals(keys[2] + 1)
                .then(products => {
                    if(products.length == 0) {
                        return res.json({success: false, msg: 'Không tìm thầy sản phẩm nào'});
                    }
                    const data = products.map(product => {
                        return {
                            pname: product.product_name,
                            pimg: product.product_img,
                            pid: product.product_id,
                            pslug: product.slug,
                            price: product.price ? product.price.toLocaleString('vi', {style: 'currency', currency: 'VND'}) : 'Liên hệ'
                        }
                    })
                    return res.render('collections', {title, data});
                })
                .catch(next)
        }

        if(level == 2) {
            const title = menuItems[keys[0]].submenu[keys[1]].title || "";
            if(!title) {
                return res.json({success: false, msg: 'Không tìm thầy sản phẩm nào'});
            }

            Products.find({})
            .where('classes.lv1').equals(keys[0] + 1)
            .where('classes.lv2').equals(keys[1] + 1)
            .then(products => {
                if(products.length == 0) {
                    return res.json({success: false, msg: 'Không tìm thầy sản phẩm nào'});
                }
                const data = products.map(product => {
                    return {
                        pname: product.product_name,
                        pimg: product.product_img,
                        pid: product.product_id,
                        pslug: product.slug,
                        price: product.price ? product.price.toLocaleString('vi', {style: 'currency', currency: 'VND'}) : 'Liên hệ'
                    }
                })
                return res.render('collections', {title,data});
            })
            .catch(next)
            
        }

        if(level == 1) {
            const title = menuItems[keys[0]].title || '';
            if(!title) {
                return res.json({success: false, msg: 'Không tìm thầy sản phẩm nào'});
            }

            Products.find({})
                .where('classes.lv1').equals(keys[0] + 1)
                .then(products => {
                    if(products.length == 0) {
                        return res.json({success: false, msg: 'Không tìm thầy sản phẩm nào'});
                    }
                    const data = products.map(product => {
                        return {
                            pname: product.product_name,
                            pimg: product.product_img,
                            pid: product.product_id,
                            pslug: product.slug,
                            price: product.price.toLocaleString('vi', {style: 'currency', currency: 'VND'})
                        }
                    })
                    return res.render('collections', {title, data});
                })
                .catch(next)
        }
        
    }
}

module.exports = CollectionController;