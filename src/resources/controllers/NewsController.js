const slugify = require('slugify');
const Posts = require('../models/Posts');
const { normalizeDate_vi } = require('../middlewares/functions');

const NewsController = {
    getDetailPost: (req, res, next) => {
        const error = req.flash('error') || '';
        const message = req.flash('message') || '';
        const slug = req.params.slug || '';

        Posts.findOne({slug})
            .then(post => {
                const data = {
                    title: post.title,
                    subtitle: post.subtitle,
                    content: post.content,
                    createdAt: post.createdAt
                }

                return res.render('newsdetail', {
                    data: data,
                    error: error,
                    message: message
                })
            })
            .catch(next);
    },
    getPostList: (req, res, next) => {
        Posts.find()
            .then(posts => {
                const data = posts.map(post => {
                    return {
                        title: post.title,
                        subtitle: (post.subtitle.length < 100) ? post.subtitle : post.subtitle.slice(0,100) + '...',
                        slug: post.slug,
                        createdAt: normalizeDate_vi(post.createdAt),
                        content: post.content,
                        image: post.image,
                    }
                })
                

                return res.render('news', {
                    posts: data,
                    topnews1: data[0],
                    topnews2: data[1],
                    topnews3: data[2]
                })
            })
    }
}

module.exports = NewsController;