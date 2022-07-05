const Collections = require('../models/Collections');
const Products = require('../models/Products');

const CollectionController = {
    getACollection: (req, res, next) => {
        return res.render('collections');
        // const collection_slug = req.params.slug;

        // Collections.findOne({collection_slug})
        //     .then(collection => {
        //         if(!collection) {
        //             return res.json({success: false, msg: 'Không tìm thấy'});
        //         }

        //         Products.find({collection_id: collection.collection_id})
        //             .then(products => {
        //                 var data = products.map(product => {
        //                     return {
        //                         pid: product.product_id,
        //                         pname: product.product_name,
        //                         price: product.price
        //                     }
        //                 })

        //                 return res.render('collections', {data});
        //             })
        //             .catch()
        //     })
        //     .catch(next);
    }
}

module.exports = CollectionController;