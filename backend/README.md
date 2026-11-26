# iBULFAS Backend – Lost & Found API

Express + MongoDB (Mongoose) REST API for **iBULFAS – Integrated BicolU Lost and Found Automated System** (Final Project, BlazingPioneers, BSIS 2B).

The server also serves the static frontend from `../frontend`, so the whole app runs at one address: <http://localhost:3000>.

## Tech stack

Node.js, Express 4, Mongoose 8, JWT (`jsonwebtoken`), `bcryptjs` for password hashing, `cors`, `dotenv`, `nodemon`.

## Folder structure

```
backend/
├── server.js            # App entry: middleware, route mounting, static frontend, error handler
├── config/db.js         # MongoDB connection + default category seeding
├── middleware/auth.js   # protect (JWT), adminOnly, wrap (async error helper)
├── models/              # User, Category, Item, Claim
├── controllers/         # auth, user, item, claim (+ notification, not active)
├── routes/              # Route files per resource
└── .env                 # Local config (not committed)
```

## Routes implemented

Base URL: `http://localhost:3000`. Protected routes need the header `Authorization: Bearer <token>`.

`GET /` is not defined; the root path serves the frontend (`index.html`).

### Auth – `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register with `name`, `email`, `password` (min 6 chars). The **first registered user becomes `admin`**; everyone after is `user`. Returns `{ token, user }`. |
| POST | `/api/auth/login` | Public | Login with `email`, `password`. Returns `{ token, user }` (token valid 7 days). |
| GET | `/api/auth/me` | Logged in | Get the current user's profile. |
| PUT | `/api/auth/me` | Logged in | Update own `name` and/or `password`. |

### Users – `/api/users`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/users/register` | Public | Same as `/api/auth/register`. |
| POST | `/api/users/login` | Public | Same as `/api/auth/login`. |
| GET | `/api/users/me` | Logged in | Same as `/api/auth/me`. |
| GET | `/api/users` | Admin | List all users (passwords excluded). |
| PUT | `/api/users/:id/role` | Admin | Update a user's `role` (`user` or `admin`) and/or `name`. |

### Items – `/api/items`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/items` | Public | List items. Query params: `type`, `category`, `status`, `q` (searches title, description, location), `reportedBy`, `page` (default 1), `limit` (default 6, max 50). Returns `{ items, total, page, pages }`. |
| GET | `/api/items/stats` | Public | Counts for the home page: `{ lost, found, resolved }`. |
| GET | `/api/items/:id` | Public | Get one item (category and reporter populated). |
| POST | `/api/items` | Logged in | Report an item. Required: `title`, `type` (`lost`/`found`), `category` (Category `_id`), `location`, `dateOccurred`. Optional: `description`, `imageUrl`, `contact`. |
| PUT | `/api/items/:id` | Owner or admin | Update `title`, `description`, `type`, `category`, `location`, `dateOccurred`, `imageUrl`, `contact`, `status`. |
| DELETE | `/api/items/:id` | Owner or admin | Delete an item and all claims on it. |

### Claims – `/api/claims`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/claims` | Logged in | Submit a claim with `item` (item `_id`) and `message`. Rejected if the item isn't `open`, you reported it yourself, or you already have a pending claim on it. |
| GET | `/api/claims` | Logged in | Your own claims plus claims on items you reported. Admins see all claims. |
| PUT | `/api/claims/:id/review` | Admin | Set `status` to `approved` or `rejected`. Approving marks the item as `claimed`. |

## Current models

**User** (`models/User.js`)

| Field | Type | Notes |
|---|---|---|
| name | String | required, trimmed |
| email | String | required, unique, lowercase |
| password | String | required, stored as a bcrypt hash |
| role | String | `user` (default) or `admin` |
| createdAt | Date | defaults to now |

**Category** (`models/Category.js`)

| Field | Type | Notes |
|---|---|---|
| name | String | required, unique |

**Item** (`models/Item.js`, with timestamps)

| Field | Type | Notes |
|---|---|---|
| title | String | required |
| description | String | default `''` |
| type | String | `lost` or `found`, required |
| category | ObjectId → Category | required |
| location | String | required |
| dateOccurred | Date | required |
| imageUrl | String | default `''` |
| contact | String | default `''` |
| status | String | `open` (default), `claimed`, `returned` |
| reportedBy | ObjectId → User | required |

**Claim** (`models/Claim.js`, with timestamps)

| Field | Type | Notes |
|---|---|---|
| item | ObjectId → Item | required |
| claimant | ObjectId → User | required |
| message | String | required |
| status | String | `pending` (default), `approved`, `rejected` |

## Connection setup

1. The server reads its settings from `backend/.env` (loaded with `dotenv` at the top of `server.js`).
2. `config/db.js` calls `mongoose.connect(process.env.MONGO_URI)`. If the connection fails, it logs the error and exits the process.
3. On the first successful connection, if the `categories` collection is empty, it seeds these defaults: Electronics, Wallets & Bags, IDs & Cards, Keys, Clothing, Books & School Supplies, Jewelry, Others.

Create `backend/.env` with:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/lostfound?retryWrites=true&w=majority
PORT=3000
JWT_SECRET=<a-long-random-string>
```

| Variable | Purpose |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string, or `mongodb://127.0.0.1:27017/lostfound` for a local MongoDB |
| `PORT` | Server port (defaults to `3000`) |
| `JWT_SECRET` | Secret used to sign and verify login tokens |

> If you use Atlas, make sure your current IP address is allowed under **Network Access** and that the database user in the URI has access to the `lostfound` database.
>
> `.env` is listed in `.gitignore`. Never commit real credentials.

## How to run the server locally

**Prerequisites:** Node.js (v18 or newer recommended) and a MongoDB database (Atlas or local).

```bash
cd backend
npm install
# create/edit .env as shown above
npm start        # runs nodemon server.js (auto-restarts on file changes)
```

Or run without auto-restart:

```bash
npm run prod     # runs node server.js
```

You should see:

```
Server running on http://localhost:3000
MongoDB Connected
```

Then open <http://localhost:3000> for the frontend. API calls go to `http://localhost:3000/api/...`.

### Quick test (Thunder Client / Postman)

1. `POST /api/auth/register` with `{ "name": "Juan", "email": "juan@test.com", "password": "123456" }`. The first account becomes admin. Copy the `token`.
2. For protected routes, add the header `Authorization: Bearer <token>`.
3. `POST /api/items` with `{ "title": "Black umbrella", "type": "lost", "category": "<categoryId>", "location": "Library", "dateOccurred": "2026-11-10" }`.
4. `GET /api/items`, then `PUT` / `DELETE /api/items/:id`.
5. With a second account, `POST /api/claims` with `{ "item": "<itemId>", "message": "Has my initials" }`, then approve it with the admin token via `PUT /api/claims/<claimId>/review` and `{ "status": "approved" }`.

To make another user an admin: `PUT /api/users/<userId>/role` with `{ "role": "admin" }` (admin token), or edit the user's `role` in MongoDB Compass.

## Known gaps (code present but not working or not mounted)

- **Categories API is disabled.** `app.use('/api/categories', ...)` is commented out in `server.js`, and `routes/categoryRoutes.js` imports `authorize` (not exported by `middleware/auth.js`) and `controllers/categoryController` (file doesn't exist). The frontend calls `GET /api/categories` to fill its category dropdowns, so it will fail until this is fixed. Categories are only created by the seed in `config/db.js`.
- **Notifications are not active.** `routes/notificationRoutes.js` and `controllers/notificationController.js` exist, but there is no `models/Notification.js` and the route isn't mounted.
- **Unrouted controller functions:** `deleteClaim` (claims) and `deleteUser` (users) are written but have no route.
- **Unused files:** `routes/routes.js` and the empty `models/Models.js`.
- `THUNDER-CLIENT-TESTS.md` is outdated (it references `/api/categories`, `/api/notifications` and `dateLostOrFound`, which don't match the current code).
