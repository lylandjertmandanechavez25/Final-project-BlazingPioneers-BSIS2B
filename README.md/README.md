# iBULFAS – Integrated BicolU Lost and Found Automated System

> **Course:** IS Elec 2 / IT 112 – Web Systems and Technologies
> **Section:** BSIS 2B | **Group 4:** BlazingPioneers
> **Adviser:** Guillermo V. Red Jr.
> **Repository:** https://l.messenger.com/l.php?u=https%3A%2F%2Fgithub.com%2Flylandjertmandanechavez25%2FFinal-project-BlazingPioneers-BSIS2B.git&h=AUDA6aqKhVOWTlVSEQT_rsDxa4uo5d9Pc7bZQJJ28ud6HinmQm6l3fZAE6t5maeBu8K6B9r5bQSH79BS5TzdMT5XnWWw-qVwTEeAxRpUDqngAXZRJBt5tQlnvgmnOQM

A full-stack web application for **Bicol University Polangui** where students and staff can report **lost** and **found** items, search the listings, and submit **ownership claims** that are approved or rejected by the finder or an administrator.

---

## 1. Project Overview

- **Purpose:** Centralize lost and found reports on campus in one searchable platform.
- **Target users:** Guests (browse), registered users (report and claim), and the admin (manage everything).
- **Tech stack:** HTML5, CSS3, Bootstrap 5, JavaScript (`fetch`), Node.js, Express, MongoDB Atlas, Mongoose, JWT authentication.

### Key features
- Register and login with roles (`user`, `admin`) using JWT
- Report lost or found items (Create)
- Browse items with search, filters (type, category, status) and pagination (Read)
- Edit reports through a modal (Update)
- Delete reports with a confirmation prompt (Delete)
- Claim workflow: submit a claim, then the owner or admin approves or rejects it
- Admin page to manage users
- Campus map page showing where items were reported
- Responsive Bootstrap 5 interface

---

## 2. Team Members and Roles

- **Angelo C. Dayson** – Project Manager: team coordination, milestone tracking, communication
- **Cher Marthyn Urbi** – Front-End Manager: HTML, CSS, Bootstrap pages and JavaScript
- **Aries Jay Caspi** – Back-End Manager: Node.js server, Express routes, API
- **John Rey Malagueno** – Database Manager: MongoDB schema, Mongoose models, Atlas
- **Lyland Jert Chavez** – GitHub Manager: repository, commits, merging
- **Test and Debugger:** All members

---

## 3. Folder Structure

```
final-project-blazingpioneers-BSIS2b/
├── frontend/
│   ├── index.html  login.html  register.html  report.html
│   ├── dashboard.html  claims.html  admin.html  profile.html  location.html
│   ├── css/style.css
│   ├── js/   common.js  home.js  login.js  register.js  report.js
│   │         dashboard.js  claims.js  admin.js  profile.js  location.js
│   └── img/
├── backend/
│   ├── server.js
│   ├── .env                (not committed)
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── models/       User  Category  Item  Claim
│   ├── controllers/  auth  user  item  claim
│   └── routes/       auth  user  item  claim  category
├── database/
├── docs/
│   └── planning/
├── .gitignore
└── README.md
```

---

## 4. Installation and Setup

### Requirements
- Node.js (LTS)
- VS Code
- A free MongoDB Atlas cluster

### Steps
1. Clone the repository
   ```bash
   git clone <repository-url>
   cd final-project-blazingpioneers-BSIS2b
   ```
2. Install the backend packages
   ```bash
   cd backend
   npm install
   ```
3. Create `backend/.env`
   ```env
   PORT=3000
   MONGO_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/lostfound?retryWrites=true&w=majority
   JWT_SECRET=your-secret-here
   ```
   In Atlas, create a database user and allow your IP address under Network Access.
4. Start the server
   ```bash
   npm start
   ```
   Wait for `Server running on http://localhost:3000` and `MongoDB Connected`.
5. Open **http://localhost:3000** in the browser. Do not open the HTML files directly from the folder.

The first account registered becomes the admin.

---

## 5. Phase 1 – Planning and Architecture Design

**Goal:** Define and document the system before coding.

**Deliverables** (in `docs/planning/`)
- Project Proposal
- Use Case Diagram
- Entity-Relationship Diagram (MongoDB style)
- Data Flow Diagram / System Architecture
- Personal role declarations
- GitHub repository with the base folders: `/frontend`, `/backend`, `/database`, `/docs` and `README.md`

**Summary**
- **Title:** Integrated BicolU Lost and Found Automated System (iBULFAS)
- **Expected participants:** Bicol University students and professors
- **Key features:** profiling, reporting, claiming, inventory, tracking status, mini map
- **Main entities:** users, items, claims, locations

---

## 6. Phase 2 – Frontend Development

**Goal:** Turn the use case diagram and ERD into responsive Bootstrap pages.

**Pages built**
- `index.html` – home page with statistics and recent items
- `register.html` – create an account (name, email, password)
- `login.html` – sign in (email, password)
- `report.html` – report a lost or found item (title, type, category, description, location, date, contact, image URL)
- `dashboard.html` – browse items, with search, filters, view, claim, edit and delete
- `claims.html` – list of claims with approve, reject and delete
- `admin.html` – user management
- `profile.html` – update name or password
- `location.html` – campus map

**Bootstrap features used**
- Responsive grid (`container`, `row`, `col`)
- Navbar, cards, badges and pagination
- Modals for viewing and editing
- Bootstrap form controls
- Toast messages for feedback

**Preparation for the API**
- Every form field has an `id` and `name` matching the ERD
- Each page has its own script in `/js/`

---

## 7. Phase 3 – Backend Development and API Integration

**Goal:** Build the Express server, the Mongoose models and the REST API.

**What was built**
- `server.js` sets up Express, CORS, JSON parsing and the routes, and serves the frontend
- `config/db.js` connects to MongoDB Atlas with Mongoose and seeds the default categories
- `models/` contains User, Category, Item and Claim
- `controllers/` contains the logic for auth, users, items and claims
- `routes/` contains the endpoints for each resource
- `middleware/auth.js` checks the JWT token and the admin role
- `.env` stores `PORT`, `MONGO_URI` and `JWT_SECRET`

**Packages used**
- `express`, `mongoose`, `cors`, `dotenv`, `nodemon`, `bcryptjs`, `jsonwebtoken`

**Other details**
- Passwords are hashed with bcrypt
- Errors are returned as JSON with proper status codes
- Endpoints were tested using Thunder Client

---

## 8. Phase 4 – Form Submission and Data Insertion

**Goal:** Connect the HTML forms to the backend routes and save the data in MongoDB.

**Forms connected**
- Register form (`js/register.js`) sends `POST /api/auth/register`
- Login form (`js/login.js`) sends `POST /api/auth/login`
- Report form (`js/report.js`) sends `POST /api/items`
- Claim form (`js/dashboard.js`) sends `POST /api/claims`

**What was implemented**
- `fetch()` requests with a JSON body, using a shared `api()` helper in `common.js`
- Client-side validation: required fields, email format, minimum password length, matching passwords
- Server-side validation with clear error messages
- Success and error feedback through alerts and toasts
- Saved documents checked in MongoDB Atlas

---

## 9. Phase 5 – Displaying and Managing Data

**Goal:** Retrieve data from the API and show it dynamically on the pages.

**Pages and endpoints**
- Home page uses `GET /api/items/stats` and `GET /api/items?limit=3`
- Dashboard uses `GET /api/items` to show item cards
- Claims page uses `GET /api/claims` to show a table
- Admin page uses `GET /api/users` to show a table

**What was implemented**
- Reusable card and table templates in JavaScript
- Search with a short delay while typing
- Filters for type, category, status and "My reports"
- Server-side pagination
- Loading, empty-result and error messages

---

## 10. Phase 6 – Update and Delete (Full CRUD)

**Goal:** Finish CRUD with edit modals and delete confirmation.

**Update**
- Items: `PUT /api/items/:id` using a prefilled edit modal
- Claims: `PUT /api/claims/:id/status` to approve or reject
- Users: `PUT /api/users/:id` using a modal (admin only)
- Profile: `PUT /api/auth/me`

**Delete**
- Items: `DELETE /api/items/:id` with a confirmation prompt
- Claims: `DELETE /api/claims/:id`
- Users: `DELETE /api/users/:id` with a confirmation prompt (admin only)

**What was implemented**
- Edit and Delete buttons with the correct `data-id` on every card and row
- Only the owner or the admin can edit or delete a report
- Approving a claim marks the item as `claimed`
- Deleting an item also removes its claims, and deleting a user removes their items and claims
- The page refreshes after each change so it matches MongoDB

---

## 11. Database Design (MongoDB)

**users**
- name, email (unique), password (hashed), role (`user` or `admin`), createdAt

**categories**
- name (unique), seeded automatically on the first run

**items**
- title, description, type (`lost` or `found`), category, location, dateOccurred, imageUrl, contact, status (`open`, `claimed`, `returned`), reportedBy

**claims**
- item, claimant, message, status (`pending`, `approved`, `rejected`)

**Relationships**
- One user has many items
- One user has many claims
- One category has many items
- One item has many claims

---

## 12. API Endpoints

Base URL: `http://localhost:3000/api`. Protected routes need the header `Authorization: Bearer <token>`.

**Authentication**
- `POST /auth/register` – register
- `POST /auth/login` – login
- `GET /auth/me` – get own profile
- `PUT /auth/me` – update own profile

**Categories**
- `GET /categories` – list categories

**Items**
- `GET /items` – list items (query: `type`, `category`, `status`, `q`, `reportedBy`, `page`, `limit`)
- `GET /items/stats` – lost, found and reunited counts
- `GET /items/:id` – get one item
- `POST /items` – create an item (login required)
- `PUT /items/:id` – update an item (owner or admin)
- `DELETE /items/:id` – delete an item (owner or admin)

**Claims**
- `GET /claims` – list own claims and claims on own items (admin sees all)
- `POST /claims` – submit a claim
- `PUT /claims/:id/status` – approve or reject (owner or admin)
- `DELETE /claims/:id` – delete a claim (claimant or admin)

**Users (admin only)**
- `GET /users` – list users
- `PUT /users/:id` – update a user
- `DELETE /users/:id` – delete a user

---

## 13. Git Workflow

```bash
git add .
git commit -m "feat: connected register form to backend API"
git push origin main
git tag phase-5 && git push origin phase-5
```

Commit prefixes: `feat:` new feature, `fix:` bug fix, `docs:` documentation, `style:` UI changes.
Never commit `backend/.env` or `node_modules/` (already in `.gitignore`).

---
