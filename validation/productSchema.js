const Joi = require('joi');

const productSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(), // Tên sản phẩm: từ 3 đến 30 ký tự
    price: Joi.number().positive().required(), // Giá: số dương
    image: Joi.string().allow(null).optional() // Hình ảnh: có thể để trống
});

module.exports = productSchema;
