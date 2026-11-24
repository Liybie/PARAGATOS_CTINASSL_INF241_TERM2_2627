/**
 * Run: npm run reset-db --prefix server
 * Clears wrong/empty collections and re-seeds caffeine_co for MongoDB Compass.
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/caffeine_co';

async function reset() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const collections = await db.listCollections().toArray();
  for (const { name } of collections) {
    await db.dropCollection(name);
    console.log(`Dropped collection: ${name}`);
  }

  await mongoose.disconnect();
  console.log('Database cleared. Run: npm run seed --prefix server');
}

reset().catch((e) => {
  console.error(e);
  process.exit(1);
});