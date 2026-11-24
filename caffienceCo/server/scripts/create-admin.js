require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const username = process.argv[2] || 'admin';
const password = process.argv[3] || '123';
const email = process.argv[4] || `${username}@caffeine.co`;

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/caffeine_co';
  await mongoose.connect(uri);

  const hash = await bcrypt.hash(password, 12);
  let admin = await Admin.findOne({ username });

  if (admin) {
    admin.password = hash;
    if (email) admin.email = email.toLowerCase();
    await admin.save();
    console.log(`Updated admin "${username}" — password set.`);
  } else {
    const emailTaken = await Admin.findOne({ email: email.toLowerCase() });
    if (emailTaken) {
      console.error(`Email ${email} already in use. Pass a different email as the 4th argument.`);
      process.exit(1);
    }
    admin = await Admin.create({
      username,
      email: email.toLowerCase(),
      password: hash,
    });
    console.log(`Created admin "${username}".`);
  }

  console.log(`Login: username "${username}" OR email "${admin.email}" | password "${password}"`);
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});