const Products = require('../models/Products');

const ProductController = {
    getProductDetail: (req, res, next) => {
        Products.findOne({ slug: req.params.slug })
            .select({ classes: 1, showPrice: 1, product_model: 1, product_size: 1, product_name: 1, slug: 1, product_img: 1, product_id: 1, brand_name: 1, price: 1, description: 1 })
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
                    brand: product.brand_name || '',
                    size: product.size || '',
                    numPrice: product.price,
                    price: product.showPrice ? product.price.toLocaleString('vi', { style: 'currency', currency: 'VND' }) : 'Liên hệ'
                }

                Products.find({})
                    .select({ showPrice: 1, product_name: 1, slug: 1, product_img: 1, product_id: 1, price: 1 })
                    .where('classes').equals(product.classes)
                    .where('product_id').ne(data.pid).limit(5)
                    .then(fr_products => {

                        let similar = fr_products.map(prod => {

                            return {
                                product_name: prod.product_name,
                                product_id: prod.product_id,
                                product_img: [prod.product_img[0]],
                                numPrice: product.price,
                                price: product.showPrice ? product.price.toLocaleString('vi', { style: 'currency', currency: 'VND' }) : 'Liên hệ',
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