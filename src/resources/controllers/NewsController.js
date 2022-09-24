
const Posts = require('../models/Posts');
const moment = require('moment');
const { includes } = require('../validators/loginValidator');

const NewsController = {
    getDetailPost: (req, res, next) => {
        const error = req.flash('error') || '';
        const message = req.flash('message') || '';
        const slug = req.params.slug || '';

        Posts.findOne({ slug })
            .then(post => {
                if (post) {
                    const data = {
                        title: post.title,
                        slug: slug,
                        subtitle: post.subtitle,
                        content: post.content,
                        
                        createdAt: post.createdAt.toLocaleString('vi-vn')
                    }
                    return res.render('newsdetail', {
                        data: data,
                        error: error,
                        message: message
                    })
                }
            })
    },
    getPostList: (req, res, next) => {
        Posts.find()
            .select({ content: 0 })
            .then(posts => {
                const data = posts.reduce((result, post) => {
                    const element = {
                        title: post.title,
                        subtitle: (post.subtitle.length < 100) ? post.subtitle : post.subtitle.slice(0, 100) + '...',
                        slug: post.slug,
                        group: post.group,
                        createdAt: post.createdAt.toLocaleString('vi-vn'),
                        content: post.content,
                        image: post.image,
                    }

                    result[element.group == 'NT' ? 0 : 1].push(element)
                    return result;
                }, [[], []])


                return res.render('news', {
                    NT: data[0],
                    TT: data[1],
                    topnews1: data[0][0],
                    topnews2: data[0][1],
                    topnews3: data[1][0]
                })
            })
    },
    getGroupNews: (req, res, next) => {
        const slug = req.params.slug;

        if (!['NT', 'TT'].includes(slug)) {
            return res.redirect('/news');
        }

        Posts.find({ group: slug })
            .then(posts => {
                if (!posts) {
                    return res.render('newsGroup', {
                        title: slug == 'NT' ? 'Tin tức Nam Thịnh' : 'Tin tức thị trường',
                        data: []
                    })
                }

                const data = posts.map(post => {
                    return {
                        title: post.title,
                        subtitle: (post.subtitle.length < 100) ? post.subtitle : post.subtitle.slice(0, 100) + '...',
                        slug: post.slug,
                        group: post.group,
                        createdAt: post.createdAt.toLocaleString('vi-vn'),
                        content: post.content,
                        image: post.image,
                    }
                })

                return res.render('newsGroup', {
                    title: slug == 'NT' ? 'Tin tức Nam Thịnh' : 'Tin tức thị trường',
                    data: data,
                })
            })

    }
}

module.exports = NewsController;