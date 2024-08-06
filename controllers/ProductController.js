const Product = require("../models/ProductModel");

// Hiển thị trang chính
exports.getHome = async (req, res) => {
  try {
    const products = await Product.find();
    res.render("home", { products });
  } catch (error) {
    console.error(error);
    res.status(500).send("Lỗi máy chủ nội bộ");
  }
};

// Hiển thị danh sách sản phẩm trên trang admin
exports.getList = async (req, res) => {
  try {
    const products = await Product.find();
    res.render('admin', { products });
  } catch (error) {
    console.error(error);
    res.status(500).send('Lỗi máy chủ nội bộ');
  }
};

// Hiển thị chi tiết sản phẩm để chỉnh sửa
exports.getDetail = async (req, res) => {
    try {
      const id = req.params.id;
      const product = await Product.findById(id);
      if (product) {
        res.render("edit", { product, errors: [] }); // Truyền `errors` mặc định là mảng rỗng
      } else {
        res.status(404).send("Sản phẩm không tìm thấy.");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Lỗi máy chủ nội bộ");
    }
  };
  

// Hiển thị form tạo mới sản phẩm
exports.create = (req, res) => {
    res.render("create", { errors: [], product: {} }); // Truyền biến product nếu cần
};


// controllers/ProductController.js

exports.save = async (req, res) => {
    try {
        const newProduct = {
            name: req.body.name,
            price: req.body.price,
            image: req.file ? req.file.filename : null,
        };

        // Tạo sản phẩm mới trong cơ sở dữ liệu
        const product = await Product.create(newProduct);

        if (product) {
            res.redirect('/admin'); // Điều hướng đến danh sách sản phẩm
        } else {
            res.status(400).render('create', { errors: ['Failed to create product'], product: newProduct });
        }
    } catch (err) {
        console.error(err);
        const errors = err.name === 'ValidationError'
            ? Object.values(err.errors).map(e => e.message)
            : ['Có lỗi xảy ra'];
        res.status(400).render('create', { errors, product: req.body });
    }
};


exports.update = async (req, res) => {
    try {
        console.log('Received request to update product with ID:', req.params.id);
        console.log('Request body:', req.body);
        console.log('Uploaded file:', req.file);

        const id = req.params.id;
        const { name, price } = req.body;

        const errors = [];
        if (!name || name.trim() === '') {
            errors.push('Tên sản phẩm không được để trống.');
        }
        if (!price || isNaN(price) || price <= 0) {
            errors.push('Giá sản phẩm phải là một số hợp lệ và lớn hơn 0.');
        }

        if (errors.length > 0) {
            return res.status(400).render('edit', { errors, product: req.body });
        }

        const updatedProduct = {
            name: req.body.name,
            price: req.body.price,
            image: req.file ? req.file.filename : null,
        };

        const product = await Product.findByIdAndUpdate(id, updatedProduct, { new: true });

        if (product) {
            res.redirect("/admin");
        } else {
            res.status(404).send("Sản phẩm không tìm thấy.");
        }
    } catch (err) {
        console.error('Error updating product:', err);
        const errors = err.name === 'ValidationError'
            ? Object.values(err.errors).map(e => e.message)
            : ['Có lỗi xảy ra'];
        res.status(400).render("edit", { errors, product: req.body });
    }
};


  
  

// Xóa sản phẩm
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await Product.findByIdAndDelete(id);
    res.redirect("/admin");
  } catch (error) {
    console.error(error);
    res.status(500).send("Có lỗi xảy ra khi xóa sản phẩm.");
  }
};

// Xử lý API lấy danh sách sản phẩm
exports.apiGetList = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ data: products });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Xử lý API lấy thông tin chi tiết sản phẩm
exports.apiGetDetail = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (product) {
      res.status(200).json({ data: product });
    } else {
      res.status(404).json({ error: "Sản phẩm không tìm thấy." });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Xử lý API lưu sản phẩm mới
exports.apiSave = async (req, res) => {
  try {
    const newProduct = {
      name: req.body.name,
      price: req.body.price,
      image: req.file ? req.file.filename : null,
    };
    await Product.create(newProduct);
    res.status(201).json({ message: "Thêm mới thành công" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Xử lý API cập nhật sản phẩm
exports.apiUpdate = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedProduct = {
      name: req.body.name,
      price: req.body.price,
      image: req.file ? req.file.filename : null,
    };
    const product = await Product.findByIdAndUpdate(id, updatedProduct, { new: true });
    if (product) {
      res.status(200).json({ message: "Update thành công" });
    } else {
      res.status(404).json({ error: "Sản phẩm không tìm thấy." });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Xử lý API xóa sản phẩm
exports.apiDelete = async (req, res) => {
  try {
    const id = req.params.id;
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.getEdit = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).send('Product not found');
        }

        res.render('edit', { product, errors: [] });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};