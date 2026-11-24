const Order = require('../models/Order');
const Product = require('../models/Product');
const { writeLog } = require('../utils/activityLog');

const generateOrderNumber = () => {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CC-${y}${m}${d}-${rand}`;
};

exports.createOrder = async (req, res, next) => {
  try {
    const {
      customerName,
      email,
      contactNumber,
      deliveryAddress,
      city,
      postalCode,
      items,
    } = req.body;

    if (
      !customerName ||
      !email ||
      !contactNumber ||
      !deliveryAddress ||
      !city ||
      !postalCode ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({ message: 'Missing required checkout fields' });
    }

    const orderItems = [];
    let subtotal = 0;
    const stockUpdates = [];

    for (const item of items) {
      const qty = Number(item.quantity);
      const productId = item.productId;

      if (!productId || !Number.isInteger(qty) || qty < 1) {
        return res.status(400).json({ message: 'Invalid cart item' });
      }

      const product = await Product.findById(productId);
      if (!product || !product.isActive) {
        return res.status(400).json({ message: `Product unavailable` });
      }

      if (product.stock < qty) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        });
      }

      subtotal += product.price * qty;
      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: qty,
        image: product.image,
      });
      stockUpdates.push({ product, qty });
    }

    for (const { product, qty } of stockUpdates) {
      const updated = await Product.findOneAndUpdate(
        { _id: product._id, stock: { $gte: qty } },
        { $inc: { stock: -qty } },
        { new: true }
      );
      if (!updated) {
        return res.status(400).json({
          message: `Stock changed while ordering. Please refresh and try again.`,
        });
      }
    }

    const order = await Order.create({
      userId: req.user?._id || null,
      orderNumber: generateOrderNumber(),
      customerName: customerName.trim(),
      email: email.trim().toLowerCase(),
      contactNumber: contactNumber.trim(),
      deliveryAddress: deliveryAddress.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      items: orderItems,
      subtotal,
      total: subtotal,
      paymentMethod: 'Cash on Delivery',
      orderStatus: 'Pending',
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

exports.trackOrder = async (req, res, next) => {
  try {
    const { orderNumber, email } = req.body;
    if (!orderNumber || !email) {
      return res.status(400).json({ message: 'Order number and email are required' });
    }

    const order = await Order.findOne({
      orderNumber: orderNumber.trim(),
      email: email.trim().toLowerCase(),
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
      total: order.total,
      createdAt: order.createdAt,
      items: order.items,
    });
  } catch (err) {
    next(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Order not found' });
    }
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const allowed = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    if (!orderStatus || !allowed.includes(orderStatus)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (orderStatus === 'Cancelled' && order.orderStatus !== 'Cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity },
        });
      }
    }

    const previous = order.orderStatus;
    order.orderStatus = orderStatus;
    await order.save();

    await writeLog(req, {
      action: 'STATUS_CHANGE',
      entity: 'Order',
      entityId: order._id,
      summary: `Order ${order.orderNumber}: ${previous} → ${orderStatus}`,
    });

    res.json(order);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Order not found' });
    }
    next(err);
  }
};