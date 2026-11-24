# Caffeine.co — MERN Coffee E-Commerce MVP

**Tagline:** Brewed for Every Day.

Specialty coffee bean storefront with guest checkout (COD), shopping cart, and protected admin dashboard.

## Stack

- **Client:** React (Vite), Tailwind CSS, React Router, Axios, Context API
- **Server:** Node.js, Express, Mongoose
- **Database:** MongoDB (`caffeine_co`)

## Prerequisites

- Node.js 18+
- MongoDB running locally (MongoDB Compass recommended)

## MongoDB Compass setup

Use this connection string (fixes empty/wrong database names):

```text
mongodb://127.0.0.1:27017/caffeine_co
```

After seeding you should see collections:

- `products` (8 coffees)
- `admins` (1 admin)
- `orders` (created when customers checkout)

If Compass shows stale or broken data:

```bash
npm run reset-db --prefix server
npm run seed --prefix server
```

## Environment variables

Copy `.env.example` to `.env` in the project root:

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | MongoDB connection (`.../caffeine_co`) |
| `PORT` | API port (default `5000`) |
| `CLIENT_URL` | Vite origin (`http://localhost:5173`) |
| `JWT_SECRET` | Sign admin JWT cookies |
| `JWT_EXPIRES_IN` | Token lifetime |
| `ADMIN_USERNAME` | Initial admin username |
| `ADMIN_EMAIL` | Initial admin login email |
| `ADMIN_PASSWORD` | Initial admin password (hashed on seed) |

## Install & run

```bash
# From project root
copy .env.example .env
npm install
npm run install:all
npm run seed --prefix server

# Terminal 1
npm run dev --prefix server

# Terminal 2
npm run dev --prefix client
```

Or concurrently (after root `npm install`):

```bash
npm run dev
```

- Storefront: http://localhost:5173  
- API health: http://localhost:5000/api/health  
- Admin: http://localhost:5173/admin/login  

Default admin (from `.env`): `admin@caffeine.co` / value of `ADMIN_PASSWORD`.

## API overview

| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/products` | Public (search, roast filter) |
| GET | `/api/products/:id` | Public |
| GET | `/api/products/admin/all` | Admin |
| POST/PUT/DELETE | `/api/products` | Admin + CSRF |
| POST | `/api/auth/login` | Public (rate limited) |
| POST | `/api/auth/logout` | Admin + CSRF |
| GET | `/api/auth/me` | Admin |
| POST | `/api/orders` | Public (guest checkout) |
| GET/PATCH | `/api/orders` | Admin |

Order totals and stock are enforced on the server; client prices are not trusted.

## Folder structure

```text
caffeine-co/
├── client/          # React storefront + admin UI
├── server/          # Express API, models, seed
├── .env.example
├── package.json
└── README.md
```

## Features implemented

- Homepage with brand hero (reference imagery), featured products, about
- Shop with 8 seeded origins, search & roast filter
- Product detail, cart (localStorage), guest COD checkout, order confirmation
- Admin login (JWT HttpOnly cookie), dashboard stats, product CRUD, order status
- bcrypt passwords, Helmet, CORS, login rate limit, CSRF on authenticated writes

## Limitations

- No online payment gateway (COD only)
- Product images use URLs (Unsplash), not file uploads
- No customer accounts or email notifications
- No automated tests in repo

## License

Private / educational MVP.