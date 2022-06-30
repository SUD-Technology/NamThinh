const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const handlebars = require('express-handlebars')
const path = require('path')
const UserRouter = require('./routers/UserRouter');
const CollectionRouter = require('./routers/CollectionRouter');
const ProductRouter = require('./routers/ProductRouter');
const db = require('./config/db');
const Products = require('./models/Products');

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
                product_id: 'LX001',
                product_name: 'Lốp xe 1',
                description: 'Sản phẩm demo đang trong quá trình thử nghiệm',
                product_img: 'lopxe.jpg',
                price: 1900000,
                showroom: '93 Hoàng Hoa Thám Q.Tân Bình',
                represent: 'Trần Minh Long',
                address: '12 Nguyễn Văn Quá Q.Gò Vấp',
                phone: '090523823',
                collection_id: 'lop-xe',
                slug: 'lop-xe-1',
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

app.listen(port, () => console.log('Server started'))