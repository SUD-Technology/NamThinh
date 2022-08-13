const Services = require('../models/Services')
const moment = require('moment');

const ServicesController = {
    getServicesList: (req, res, next) => {
        Services.find()
            .then(services => {
                const data = services.map(item => {
                    return {
                        title: item.title,
                        subtitle: item.subtitle,
                        slug: item.slug,
                        createdAt: item.createdAt,
                        content: item.content,
                        image: item.image
                    }
                })

                return res.render('service', {
                    services: data
                })
            })
    },
    getDetailServices: (req, res, next) => {
        const error = req.flash('error') || '';
        const message = req.flash('message') || '';
        const slug = req.params.slug || '';

        Services.findOne({ slug })
            .then(service => {
                const data = {
                    title: service.title,
                    slug: slug,
                    subtitle: service.subtitle,
                    content: service.content,
                    createdAt: moment(service.createdAt).format('lll')
                }
                return res.render('servicesDetail', {
                    data: data,
                    error: error,
                    message: message
                })
            })
    }
}

module.exports = ServicesController