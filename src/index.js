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
const getProductList = require('./resources/middlewares/products');
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

app.get('/home', getProductList, (req, res, next) => {
    let data = {
        Lop: [],
        Xe: [],
        PhuTung: [],
        Dau: []
    }

    const products = req.products;
    products.forEach(product => {
        const type = product.classes.lv1;
        const current_product = {
            pname: product.product_name,
            pimg: product.product_img[0],
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
        // else {
        //     break;
        // }
    })
    return res.render('home', { data })
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