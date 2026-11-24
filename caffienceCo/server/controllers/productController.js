const Product = require('../models/Product');
const { writeLog } = require('../utils/activityLog');

exports.getProducts = async (req, res, next) => {
  try {
    const { search, roastLevel } = req.query;
    const filter = { isActive: true };

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    if (roastLevel) {
      filter.roastLevel = roastLevel;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    next(err);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Product not found' });
    }
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, image, origin, roastLevel, weight, stock, isActive } =
      req.body;

    if (!name || !description || price == null || !image || !origin || !roastLevel) {
      return res.status(400).json({ message: 'Missing required product fields' });
    }

    const numericPrice = Number(price);
    const numericStock = Number(stock ?? 0);
    if (numericPrice < 0 || numericStock < 0) {
      return res.status(400).json({ message: 'Price and stock must be non-negative' });
    }

    const product = await Product.create({
      name,
      description,
      price: numericPrice,
      image,
      origin,
      roastLevel,
      weight: weight || '250g',
      stock: numericStock,
      isActive: isActive !== false,
    });

    await writeLog(req, {
      action: 'CREATE',
      entity: 'Product',
      entityId: product._id,
      summary: `Added product "${product.name}"`,
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const updates = { ...req.body };

    if (updates.price != null) {
      updates.price = Number(updates.price);
      if (updates.price < 0) {
        return res.status(400).json({ message: 'Price must be non-negative' });
      }
    }
    if (updates.stock != null) {
      updates.stock = Number(updates.stock);
      if (updates.stock < 0) {
        return res.status(400).json({ message: 'Stock must be non-negative' });
      }
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await writeLog(req, {
      action: 'UPDATE',
      entity: 'Product',
      entityId: product._id,
      summary: `Updated product "${product.name}"`,
    });

    res.json(product);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Product not found' });
    }
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await writeLog(req, {
      action: 'DELETE',
      entity: 'Product',
      entityId: product._id,
      summary: `Deleted product "${product.name}"`,
    });

    res.json({ message: 'Product deleted' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Product not found' });
    }
    next(err);
  }
};

exports.getAllProductsAdmin = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    next(err);
  }
};