// server.js
const express = require('express');
const mongoose = require('mongoose');
const ProductController = require('./controllers/ProductController');
const AuthController = require('./controllers/AuthController');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');
const authenticateToken = require('./middleware/auth');

const app = express();
const port = 3000;
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

// Khai báo sử dụng EJS
app.set('view engine', 'ejs');
app.set('views', './views');

// Khai báo các thư mục tĩnh
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(errorHandler);

// Cấu hình Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

mongoose.connect('mongodb://127.0.0.1:27017/wd18411')
    .then(result => {
        // Router cho trang chủ
        app.get('/', ProductController.getHome);

        
        app.get('/admin', authenticateToken, ProductController.getList);
        app.get('/create', authenticateToken, ProductController.create);
        app.get('/edit/:id', authenticateToken, ProductController.getDetail);
        app.post('/save', upload.single('image'), authenticateToken, ProductController.save);
        app.post('/update/:id', upload.single('image'), authenticateToken, ProductController.update);
        app.get('/delete/:id', authenticateToken, ProductController.delete);

        // Router cho API
        app.get('/products', ProductController.apiGetList);
        app.get('/products/:id', ProductController.apiGetDetail);
        app.post('/products', upload.single('image'), ProductController.apiSave);
        app.put('/products/:id', upload.single('image'), ProductController.apiUpdate);
        app.delete('/products/:id', ProductController.apiDelete);

        // Router cho API xác thực
        app.post('/register', AuthController.register);
        app.post('/login', AuthController.login);

        // Router cho trang đăng ký và đăng nhập
        app.get('/register', AuthController.getRegister);
        app.get('/login', AuthController.getLogin);

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch(err => {
        console.error(err);
    });
