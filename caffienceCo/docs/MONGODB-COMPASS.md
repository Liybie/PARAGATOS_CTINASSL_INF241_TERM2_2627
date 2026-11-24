# Fix MongoDB Compass for Caffeine.co

## Correct connection

In Compass, create a connection with:

```text
mongodb://127.0.0.1:27017/caffeine_co
```

The database name **`caffeine_co`** (underscore) must match `MONGODB_URI` in your `.env` file.

## Common problems

| Issue | Fix |
|-------|-----|
| Empty database after connect | Run seed: `npm run seed --prefix server` |
| Wrong database name in sidebar | Disconnect; use URI above including `/caffeine_co` |
| Old test data / broken schema | `npm run reset-db --prefix server` then seed again |
| Collections named `test` only | You connected without database path — use full URI |

## Expected collections

- **products** — 8 documents after seed
- **admins** — 1 document
- **orders** — grows when customers place orders

## Local MongoDB (no replica set)

Checkout uses atomic stock updates (not multi-document transactions), so a **standalone** MongoDB instance—the default with Compass—is supported. You do **not** need to configure a replica set for this MVP.

## Verify from terminal

With MongoDB running and dependencies installed:

```bash
npm run seed --prefix server
```

You should see:

```text
MongoDB connected ...
Admin created: admin@caffeine.co
Seeded 8 products.
Database ready in MongoDB Compass: caffeine_co
```