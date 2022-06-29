const express = require('express');
const router = express.Router();
const Products = require('../models/Products');

router.get('/:slug', (req, res, next) => {
    Products.findOne({slug: req.params.slug})
        .then(product => {
            let data = {
                pid: product.product_id || '',
                pname: product.product_name ||  '',
                desc: product.description || '',
                pimg: product.product_img || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALEAAACFCAMAAAAjHOlMAAAAUVBMVEXa2tpVVVXd3d3i4uJSUlJKSkqioqJCQkLGxsZcXFybm5tgYGDQ0NBPT09vb2++vr6GhoZlZWWtra1/f391dXXo6Oizs7ONjY2UlJRqamozMzPBs1UqAAABuklEQVR4nO3Y23KCMBSF4bBJCGK2nIRi3/9BK0cRqwZnOmym67siysU/DIQEpQAAAAAAAAAAAAAAAAAAAAB2hMIPbBoc6cNq5y2Tw8jotfi0cXGwlpZQ7H+BZRTro7dcRrFJnS8SUhyH5EdVgRZRnNLrs2j6fx/F5OpUDWfsopi+jLUn15+yh2Iq2vnPZP1oD8Xq3M7BAbtuIK6Yfmnpi43MYorPanm5w6S9K/jUj8QVNzZ7vEFyy4ZTkU8exRyYcplMqsgaN0QKKw6zdtDc3hfjpQ/D8SdZxZQG7UNmvqagxzlEVrEquVv/mmi45LVNlm2iiikdF/c8JF+Ym8XcIav4wuMuw9bUbgGvY1PeJ0sqpnoKvqqJ3KG7q0s3T5ZU7C56tpUzdZX1Nwkf4lmyoOKwuNui6mM0HvIxvRUKKlasg7tkMzssBK7ou8fs6XZfR2OjnOJxLn7iujyWtq6g18XTLCep2PBLNu9mOTnFqo7eKZSsYo9vFZKK48r3y7GQYs4SX+17RUBxwMabkOJ1ULyyOPm2q+XVhsXKxR948yn0j3l+OX6cmgEAAAAAAAAAAAAAAAAAAOCf+gFBniPHCZAaTgAAAABJRU5ErkJggg==',
                showroom: product.showroom || '',
                price: product.price.toLocaleString('vi', { style: 'currency', currency: 'VND' }) || 'Liên hệ',
                represent: product.represent || '',
                address: product.addess || '',
                phone: product.phone || '',
            }

            return res.render('detail', {data});
        })
        .catch(next);
})

module.exports = router;