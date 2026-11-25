# iBULFAS - Integrated BicolU Lost and Found Automated System

# Backend – Lost & Found API

## Run locally
```bash
cd backend
npm install
npm start          # nodemon server.js  -> http://localhost:3000
```
Edit `.env` first: `MONGO_URI` (local MongoDB or Atlas), `PORT`, `JWT_SECRET`.

## Models
`User`, `Category`, `Item`, `Claim` (see `/models`).

## Connection setup
`config/db.js` connects with Mongoose using `MONGO_URI` and seeds default categories.

## Routes
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /api/auth/register | public | Register (first user becomes admin) |
| POST | /api/auth/login | public | Login, returns JWT |
| GET/PUT | /api/auth/me | user | Get / update profile |
| GET | /api/categories | public | List categories |
| GET | /api/items | public | List items (`type, category, status, q, reportedBy, page, limit`) |
| GET | /api/items/stats | public | Counts for home page |
| GET | /api/items/:id | public | One item |
| POST | /api/items | user | Create item |
| PUT | /api/items/:id | owner/admin | Update item |
| DELETE | /api/items/:id | owner/admin | Delete item |
| GET | /api/claims | user | Own claims + claims on own items (admin: all) |
| POST | /api/claims | user | Submit claim |
| PUT | /api/claims/:id/status | owner/admin | `{status: approved|rejected}` |
| DELETE | /api/claims/:id | claimant/admin | Delete claim |
| GET/PUT/DELETE | /api/users[/:id] | admin | Manage users |

## Testing with Thunder Client / Postman
1. `POST /api/auth/register` → copy `token`.
2. Add header `Authorization: Bearer <token>` for protected routes.
3. `GET /api/categories` → copy a category `_id`, then `POST /api/items` with `{ "title":"Wallet","type":"found","category":"<id>","location":"Library","dateOccurred":"2026-10-20" }`.
4. Test `GET`, `PUT /api/items/:id`, `DELETE /api/items/:id`.





