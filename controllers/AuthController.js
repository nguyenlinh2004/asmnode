// AuthController.js
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

// Hiển thị trang đăng ký
exports.getRegister = (req, res) => {
    const error = req.query.error || null;
    res.render('register', { error });
};

// Hiển thị trang đăng nhập
exports.getLogin = (req, res) => {
    const error = req.query.error || null;
    res.render('login', { error });
};

// Schema validation for registration
const registerSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

// Xử lý đăng ký
exports.register = async (req, res) => {
    try {
        // Validate request body
        const { error } = registerSchema.validate(req.body);
        if (error) {
            return res.redirect(`/register?error=${encodeURIComponent(error.details[0].message)}`);
        }

        const { username, email, password } = req.body;
        const existedEmail = await User.findOne({ email });

        if (existedEmail) {
            return res.redirect('/register?error=Email đã tồn tại');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        // Tạo token
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1h' }
        );

        // Thiết lập cookie với token
        res.cookie('token', token, { httpOnly: true });

        res.redirect('/login');
    } catch (err) {
        console.error(err); // Log lỗi để dễ debug
        res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình đăng ký' });
    }
};

// Schema validation for login
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

// Xử lý đăng nhập
exports.login = async (req, res) => {
    try {
        // Validate request body
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return res.redirect(`/login?error=${encodeURIComponent(error.details[0].message)}`);
        }

        const { email, password } = req.body;

        // Tìm người dùng theo email
        const user = await User.findOne({ email });

        if (!user) {
            return res.redirect('/login?error=Thông tin đăng nhập không chính xác');
        }

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.redirect('/login?error=Thông tin đăng nhập không chính xác');
        }

        // Tạo token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1h' }
        );

        // Thiết lập cookie với token
        res.cookie('token', token, { httpOnly: true });

        // Trả về trang quản trị
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};
