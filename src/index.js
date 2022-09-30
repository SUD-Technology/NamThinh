const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const handlebars = require('express-handlebars')
const path = require('path')
const UserRouter = require('./resources/routers/UserRouter');

const db = require('./config/db');
const Products = require('./resources/models/Products');
const Posts = require('./resources/models/Posts')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('express-flash')
const bodyParser = require('body-parser')


const CollectionRouter = require('./resources/routers/CollectionRouter');
const ProductRouter = require('./resources/routers/ProductRouter');
const AdminRouter = require('./resources/routers/AdminRouter');
const NewsRouter = require('./resources/routers/NewsRouter');
const DiscountRouter = require('./resources/routers/DiscountRouter');
const ServicesRouter = require('./resources/routers/ServicesRouter');
const RecruitRouter = require('./resources/routers/RecruitRouter');

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

app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ limit: '1000mb', extended: true }));
app.use(require("cookie-parser")("abc"));
app.use(require("express-session")());
db.connect();


// Session & Cookie
app.use(cookieParser('tkh'))
app.use(session({ cookie: { maxAge: 300000 } }))
app.use(flash())
app.use(bodyParser.urlencoded({ extended: false }))

const About = require('./resources/models/About');
const Discounts = require('./resources/models/Discounts')
const Policy = require('./resources/models/Policy')
const Partners = require('./resources/models/Partners')

// About.find({})
//     .then(abouts => {
//         if (abouts.length == 0) {
//             let defaultAbout = {
//                 content: ''
//             }
//             new About(defaultAbout).save()
//         }
//     })

app.get('/aboutus', (req, res) => {
    About.findOne({})
        .then(about => {
            let content = about.content;
            return res.render('aboutus', { content });
        })

})

app.get('/', (req, res) => {
    res.render('index', { hide: true, index: true })
})

function loadProducts(array) {
    return array.map(product => {
        return {
            pname: product.product_name,
            pimg: [product.product_img[0]] || [''],
            pid: product.product_id,
            size: product.size,
            pslug: product.slug,
            numPrice: product.price,
            price: product.showPrice ? product.price.toLocaleString('vi', { style: 'currency', currency: 'VND' }) : 'Liên hệ',
            status: product.status
        }
    })
}

app.get('/home', async (req, res, next) => {
    const l1 = await Products.find({})
        .select({ description: 0 })
        .sort({ createdAt: -1 })
        .where('classes.lv1').equals(1).limit(5)
    const l2 = await Products.find({})
        .select({ description: 0 })
        .sort({ createdAt: -1 })
        .where('classes.lv1').equals(2).limit(5)
    const l3 = await Products.find({})
        .select({ description: 0 })
        .sort({ createdAt: -1 })
        .where('classes.lv1').equals(3).limit(5)
    const l4 = await Products.find({})
        .select({ description: 0 })
        .sort({ createdAt: -1 })
        .where('classes.lv1').equals(4).limit(5)

    let data = {
        Lop: loadProducts(l1),
        Xe: loadProducts(l2),
        PhuTung: loadProducts(l3),
        DauNhot: loadProducts(l4)
    }

    let bestsellers = await Products.find({hot: 1})
        .select({ description: 0 })
        .sort({ updatedAt: -1 })
        .limit(15)
        .then(products => {
            return loadProducts(products);
        })

    const partners = await Partners.find({})
        .then(ps => {
            return ps.map(p => {
                return {
                    name: p.partner_name,
                    image: p.image
                }
            })
        })

    return Discounts.find({})
        .select({ content: 0 })
        .limit(4)
        .then(discounts => {
            let _discounts = [];
            if (discounts) {
                _discounts = discounts.map(dc => {
                    return {
                        image: dc.image,
                        slug: dc.slug
                    }
                })
            }
            return res.render('home', {
                homepage: true,
                firstSlide: bestsellers.slice(0,5),
                secondSlide: bestsellers.slice(5,10),
                thirdSlide: bestsellers.slice(10,15),
                data, _discounts, partners,
                position: req.session.position,
            })
        })
        .catch(next)
})



app.get('/contact', (req, res) => {
    res.render('contact')
})



app.get('/policy/:slug', (req, res) => {
    const slug = req.params.slug;

    Policy.findOne({ slug })
        .then(policy => {
            if (policy) {
                let data = {
                    content: policy.content,
                }

                return res.render('policy', {
                    layout: 'main',
                    title: policy.name,
                    slug,
                    data,
                })
            }
        })

})

app.get('/shopping-cart', (req, res) => {
    res.render('product-cart', { success: req.flash('success'), error: req.flash('error'), total: req.flash('total') })
})

app.use('/users', UserRouter);
app.use('/collections', CollectionRouter);
app.use('/products', ProductRouter);
app.use('/admin', AdminRouter);
app.use('/news', NewsRouter);
app.use('/discount', DiscountRouter);
app.use('/service', ServicesRouter)
app.use('/tuyen-dung', RecruitRouter);

app.use(function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + "");
});

app.listen(port, () => console.log('Server started'))
