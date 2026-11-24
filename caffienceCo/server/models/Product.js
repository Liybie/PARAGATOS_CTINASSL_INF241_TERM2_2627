const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    origin: { type: String, required: true },
    roastLevel: {
      type: String,
      required: true,
      enum: ['Light', 'Medium', 'Medium-Dark', 'Dark'],
    },
    weight: { type: String, default: '250g' },
    stock: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);