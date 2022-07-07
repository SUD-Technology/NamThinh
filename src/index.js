const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const handlebars = require('express-handlebars')
const path = require('path')
const UserRouter = require('./routers/UserRouter');
const CollectionRouter = require('./routers/CollectionRouter');
const ProductRouter = require('./routers/ProductRouter');
const AdminRouter = require('./routers/AdminRouter')
const db = require('./config/db');
const Products = require('./models/Products');
const slugify = require('slugify');

app.engine('hbs', handlebars.engine({
    extname: 'hbs'
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'resources/views'))
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
db.connect();

Products.find({})
    .then(products => {
        if (products.length == 0) {
            const default_product = {
                product_id: 'GL283A+',
                product_name: 'Lốp xe tải nặng',
                product_img: 'GL283A+.png',
                description: 'Sản phẩm demo đang trong quá trình thử nghiệm',
                brand_name: 'ADVANCE/SAMSON',
                specification: [
                    {
                        size: '7.00R16',
                        ratio: '14PR',
                        depth: '12mm',
                        load: '118/114',
                        speed: 'L',
                        wheel: '5.50F'
                    },
                    {
                        size: '7.50R16',
                        ratio: '14PR',
                        depth: '14mm',
                        load: '122/118',
                        speed: 'L',
                        wheel: '6.00G'
                    },
                    {
                        size: '8.25R16',
                        ratio: '16PR',
                        depth: '14.5mm',
                        load: '128/124',
                        speed: 'K',
                        wheel: '6.50H'
                    },
                ],
                classes: {
                    lv1: 1,
                    lv2: 1,
                    lv3: 2
                },
                price: 0,
                slug: slugify('Lốp xe tải nặng GL283A+', {
                    replacement: '-',
                    remove: false,
                    lower: false,
                    strict: false,
                    locale: 'vi',
                    trim: true
                })
            }

            new Products(default_product).save()
        }
    })

app.get('/', (req, res) => {
    res.render('index', { index: true })
})

app.get('/home', (req, res) => {
    res.render('home')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/cart', (req, res) => {
    res.render('product-cart')
})

app.get('/contact', (req, res) => {
    res.render('contact')
})
app.use('/users', UserRouter);
app.use('/collections', CollectionRouter);
app.use('/products', ProductRouter);
app.use('/admin', AdminRouter)
app.listen(port, () => console.log('Server started'))