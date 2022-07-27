const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const handlebars = require('express-handlebars')
const path = require('path')
const UserRouter = require('./resources/routers/UserRouter');
const CollectionRouter = require('./resources/routers/CollectionRouter');
const ProductRouter = require('./resources/routers/ProductRouter');
const AdminRouter = require('./resources/routers/AdminRouter')
const db = require('./config/db');
const Products = require('./resources/models/Products');
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('express-flash')
const bodyParser = require('body-parser')

app.engine('hbs', handlebars.engine({
    extname: 'hbs'
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'resources/views'))
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("cookie-parser")("abc"));
app.use(require("express-session")());
db.connect();


// Session & Cookie
app.use(cookieParser('tkh'))
app.use(session({ cookie: { maxAge: 300000 } }))
app.use(flash())
app.use(bodyParser.urlencoded({ extended: false }))

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
    return res.render('home', { data, admin: req.session.username })
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/cart', (req, res) => {
    res.render('product-cart')
})

app.get('/news', (req, res) => {
    res.render('news')
})

app.get('/contact', (req, res) => {
    res.render('contact')
})


app.use('/users', UserRouter);
app.use('/collections', CollectionRouter);
app.use('/products', ProductRouter);
app.use('/admin', AdminRouter)
app.listen(port, () => console.log('Server started'))