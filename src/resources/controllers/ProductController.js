const Products = require('../models/Products');

const ProductController = {
    getProductDetail: (req, res, next) => {
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
                    size: product.size || '',
                    price: product.showPrice ? product.price.toLocaleString('vi', { style: 'currency', currency: 'VND' }) : 'Liên hệ',

                }

                Products.find({ classes: product.classes })
                    .where('product_id').ne(data.pid)
                    .then(fr_products => {

                        let similar = fr_products.map(prod => {

                            return {
                                product_name: prod.product_name,
                                product_id: prod.product_id,
                                product_img: [prod.product_img[0]],
                                size: prod.size,
                                price: prod.showPrice ? prod.price.toLocaleString('vi', { style: 'currency', currency: 'VND' }) : 'Liên hệ',
                                slug: prod.slug
                            }
                        });

                        shuffle(similar);

                        return res.render('detail', { data, similar: similar.slice(0, 5), position: req.session.position });
                    })


            })
            .catch(next);
    }
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

module.exports = ProductController;