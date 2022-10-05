const Discounts = require('../models/Discounts');
const moment = require('moment');

const DiscountController = {
    getDiscountList: (req, res, next) => {
        Discounts.find()
            .select({ content: 0 })
            .then((discounts) => {
                const data = discounts.map((dis) => {
                    return {
                        title: dis.title,
                        subtitle: dis.subtitle,
                        slug: dis.slug,
                        createdAt: dis.createdAt,
                        content: dis.content,
                        image: dis.image,
                    };
                });

                return res.render('discount', {
                    discounts: data,
                    discount1: data[0],
                });
            });
    },
    getDetailDiscount: (req, res, next) => {
        const error = req.flash('error') || '';
        const message = req.flash('message') || '';
        const slug = req.params.slug || '';

        Discounts.findOne({ slug }).then((discount) => {
            const data = {
                title: discount.title,
                slug: slug,
                subtitle: discount.subtitle,
                content: discount.content,
                image: discount.image,
                createdAt: moment(discount.createdAt).format('lll'),
            };
            return res.render('discountDetail', {
                data: data,
                error: error,
                message: message,
            });
        });
    },
};

module.exports = DiscountController;
