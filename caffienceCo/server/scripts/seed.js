require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Admin = require('../models/Admin');

const products = [
  {
    name: 'Ethiopian Yirgacheffe',
    description:
      'Bright, floral notes with hints of citrus and bergamot. A classic single-origin for pour-over lovers.',
    price: 549,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&q=80',
    origin: 'Ethiopia',
    roastLevel: 'Light',
    weight: '250g',
    stock: 40,
    isActive: true,
  },
  {
    name: 'Colombian Supremo',
    description: 'Balanced body with caramel sweetness and a clean, nutty finish.',
    price: 499,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80',
    origin: 'Colombia',
    roastLevel: 'Medium',
    weight: '250g',
    stock: 55,
    isActive: true,
  },
  {
    name: 'Brazilian Santos',
    description: 'Smooth and mellow with chocolate undertones—ideal for everyday brewing.',
    price: 449,
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80',
    origin: 'Brazil',
    roastLevel: 'Medium',
    weight: '250g',
    stock: 60,
    isActive: true,
  },
  {
    name: 'Sumatra Mandheling',
    description: 'Full-bodied with earthy depth and low acidity. Perfect for french press.',
    price: 529,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
    origin: 'Indonesia',
    roastLevel: 'Dark',
    weight: '250g',
    stock: 35,
    isActive: true,
  },
  {
    name: 'Guatemala Antigua',
    description: 'Rich cocoa notes with a subtle smoky spice and velvety mouthfeel.',
    price: 519,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80',
    origin: 'Guatemala',
    roastLevel: 'Medium-Dark',
    weight: '250g',
    stock: 45,
    isActive: true,
  },
  {
    name: 'Kenya AA',
    description: 'Vibrant acidity with blackcurrant and wine-like complexity.',
    price: 579,
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&q=80',
    origin: 'Kenya',
    roastLevel: 'Light',
    weight: '250g',
    stock: 30,
    isActive: true,
  },
  {
    name: 'Costa Rica Tarrazú',
    description: 'Honey-sweet with bright citrus and a crisp, clean finish.',
    price: 539,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80',
    origin: 'Costa Rica',
    roastLevel: 'Medium',
    weight: '250g',
    stock: 50,
    isActive: true,
  },
  {
    name: 'Vietnamese Robusta',
    description: 'Bold and intense with dark chocolate bitterness—crafted for strong brews.',
    price: 399,
    image: 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=600&q=80',
    origin: 'Vietnam',
    roastLevel: 'Dark',
    weight: '250g',
    stock: 70,
    isActive: true,
  },
];

const seed = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/caffeine_co';
  await mongoose.connect(uri);

  const username = process.env.ADMIN_USERNAME || 'admin';
  const email = process.env.ADMIN_EMAIL || 'admin@caffeine.co';
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';

  let admin = await Admin.findOne({ email });
  if (!admin) {
    const hash = await bcrypt.hash(password, 12);
    admin = await Admin.create({ username, email, password: hash });
    console.log(`Admin created: ${email}`);
  } else {
    console.log(`Admin already exists: ${email}`);
  }

  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products.`);
  } else {
    console.log(`Products collection already has ${count} documents — skipping product seed.`);
  }

  console.log(`Database ready in MongoDB Compass: caffeine_co`);
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});