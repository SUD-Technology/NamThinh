const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const handlebars = require('express-handlebars')
const path = require('path')
const UserRouter = require('./resources/routers/UserRouter');
const CollectionRouter = require('./resources/routers/CollectionRouter');
const ProductRouter = require('./resources/routers/ProductRouter');
const AdminRouter = require('./resources/routers/AdminRouter');
const NewsRouter = require('./resources/routers/NewsRouter');
const DiscountRouter = require('./resources/routers/DiscountRouter');
const ServicesRouter = require('./resources/routers/ServicesRouter');
const db = require('./config/db');
const Products = require('./resources/models/Products');
const Posts = require('./resources/models/Posts')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('express-flash')
const bodyParser = require('body-parser')
const moment = require('moment');

app.engine('hbs', handlebars.engine({
    extname: 'hbs',
    helpers: {
        isAdmin: function (val, options) {
            if (val == 'admin')
                return options.fn(this)
        },
        isSale: function (val, options) {
            if (val == 'sale' || val == 'admin')
                return options.fn(this)
        },
        isAccountant: function (val, options) {
            if (val == 'accountant' || val == 'admin')
                return options.fn(this)
        },
        isFirstPage: function (page) {
            return page == 1
        },
        isLastPage: function (current, pages) {
            return current == pages
        },
        pagination: function (current, pages, options) {
            let obj = options.hash
            let lv1 = obj.lv1 || ''
            let lv2 = obj.lv2 || ''
            let lv3 = obj.lv3 || ''
            let brand = encodeURI(obj.brand) || ''
            let origin = encodeURI(obj.origin) || ''
            let product_name = encodeURI(obj.product_name) || ''

            if (pages < 1) {
                return `<li class="page-item disabled"><a class="page-link" href="#">1</a>
                </li>`
            }
            let i = (Number(current) > 3 ? Number(current) - 2 : 1)
            let html = ``
            if (i !== 1)
                html += `<li class="page-item disabled"><a class="page-link" href="#">...</a>
                </li>`
            for (; i <= (Number(current) + 2) && i <= pages; i++) {
                if (i == current)
                    html += `<li class="page-item active"><a class="page-link" href="/admin/product-manager/?lv1=${lv1}&lv2=${lv2}&lv3=${lv3}&brand=${brand}&origin=${origin}&product_name=${product_name}&page=${i}">${i}</a>
                    </li>`
                else
                    html += `<li class="page-item"><a class="page-link" href="/admin/product-manager/?lv1=${lv1}&lv2=${lv2}&lv3=${lv3}&brand=${brand}&origin=${origin}&product_name=${product_name}&page=${i}">${i}</a>
                    </li>`
                if (i == Number(current) + 2 && i < pages) {
                    html += `<li class="page-item disabled"><a class="page-link" href="#">...</a>
                    </li>`
                }
            }
            return html
        },
        select: function (selected, options) {
            return options.fn(this).replace(
                new RegExp(' value=\"' + selected + '\"'),
                '$& selected="selected"');
        },
        inc: function (value, options) {
            return parseInt(value) + 1;
        }
    }
}))

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'resources/views'))
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(require("cookie-parser")("abc"));
app.use(require("express-session")());
db.connect();


// Session & Cookie
app.use(cookieParser('tkh'))
app.use(session({ cookie: { maxAge: 300000 } }))
app.use(flash())
app.use(bodyParser.urlencoded({ extended: false }))

const About = require('./resources/models/About');
About.find({})
    .then(abouts => {
        if(abouts.length == 0) {
            let defaultAbout = {
                content: ''            }
            new About(defaultAbout).save()
        }
    })

app.get('/aboutus', (req, res) => {
    About.findOne({})
        .then(about => {
            let content = about.content;
            return res.render('aboutus', {content});
        })

})

app.get('/', (req, res) => {
    res.render('index', { hide: true, index: true })
})



app.get('/home', async (req, res, next) => {
    let data = {
        Lop: [],
        Xe: [],
        PhuTung: [],
        Dau: []
    }

    const products = await Products.find({}).select({ product_name: 1, product_img: 1, product_id: 1, slug: 1, price: 1, description: 1, classes: 1 });
    products.forEach(product => {
        const type = product.classes.lv1;
        const current_product = {
            pname: product.product_name,
            pimg: [product.product_img[0]] || [''],
            pid: product.product_id,
            pslug: product.slug,
            price: product.price ? product.price.toLocaleString('vi', { style: 'currency', currency: 'VND' }) : 'Liên hệ',
            description: product.description
        }

        if (type == 1 && data.Lop.length < 10) {
            data.Lop.push(current_product);
        }
        else if (type == 2 && data.Xe.length < 10) {
            data.Xe.push(current_product);
        }
        else if (type == 3 && data.PhuTung.length < 10) {
            data.PhuTung.push(current_product);
        }
        else if (type == 4 && data.Dau.length < 10) {
            data.Dau.push(current_product);
        }
    })
    return Posts.find().limit(3)
        .then(posts => {
            const dataPosts = posts.map(post => {
                return {
                    title: post.title,
                    subtitle: (post.subtitle.length < 100) ? post.subtitle : post.subtitle.slice(0, 100) + '...',
                    slug: post.slug,
                    createdAt: moment(post.createdAt).format('lll'),
                    content: post.content,
                    image: post.image,
                }
            })

            return res.render('home', {
                homepage: true,
                data,
                position: req.session.position,
                topnews1: dataPosts[0],
                topnews2: dataPosts[1],
                topnews3: dataPosts[2]
            })

        })
        .catch(() => {
            return res.render('home', { homepage: true, data, position: req.session.position })
        })

})



app.get('/contact', (req, res) => {
    res.render('contact')
})



app.get('/policy', (req, res) => {
    res.render('policy');
})



app.use('/users', UserRouter);
app.use('/collections', CollectionRouter);
app.use('/products', ProductRouter);
app.use('/admin', AdminRouter);
app.use('/news', NewsRouter);
app.use('/discount', DiscountRouter);
app.use('/service', ServicesRouter)
app.listen(port, () => console.log('Server started'))