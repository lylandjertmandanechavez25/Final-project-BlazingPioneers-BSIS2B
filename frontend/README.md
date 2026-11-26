# iBULFAS – Frontend (Lab 11)

**Integrated BicolU Lost and Found Automated System** · Group 4 – BlazingPioneers · BSIS 2B
Course: IS Elec 2 / IT 112 – Web Systems and Technologies · Adviser: Guillermo V. Red Jr.

This README explains what was implemented this week (the Bootstrap 5 frontend in `/frontend`) and how it aligns with the use case diagram, ERD and system architecture from the Phase 1 proposal. Screenshots are in `/docs/lab11/`.

---

## 1. Planning review (Step 1)

### User roles
| Source | Roles |
|---|---|
| Proposal (use case diagram + ERD) | **Admin**, **Staff**, **Informant** |
| Frontend as built | **Guest** (not logged in), **User** (maps to Informant), **Admin** |

The frontend uses the same two roles as the backend (`user`, `admin`). The **Staff** role from the proposal is not separated yet.

### Pages each role needs
| Page | File | Guest | User | Admin |
|---|---|:-:|:-:|:-:|
| Home (stats, how it works, recent items) | `index.html` | ✅ | ✅ | ✅ |
| Register | `register.html` | ✅ | | |
| Login | `login.html` | ✅ | | |
| Browse items (search, filters, view, claim, edit) | `dashboard.html` | view only | ✅ | ✅ |
| Report lost/found item | `report.html` | | ✅ | ✅ |
| Claims (own claims and claims on own items) | `claims.html` | | ✅ | ✅ (all) |
| Profile | `profile.html` | | ✅ | ✅ |
| User management | `admin.html` | | | ✅ |

### Navigation flow (from the architecture diagram)
- The navbar is built by `renderNavbar()` in `js/common.js`, so every page shows the same menu, adjusted to the role:
  - **Guest:** Home · Browse Items · Login · Register
  - **User:** Home · Browse Items · Report Item · Claims · Profile · Logout
  - **Admin:** the user links plus **Admin**
- Typical flow: `index` → `register` → `login` → `dashboard` → (`report` or claim an item) → `claims`. Admin also goes to `admin`.
- `requireAuth()` sends guests to `login.html`, and non-admins away from `admin.html`.

---

## 2. Folder structure (Step 2)

```
frontend/
├── index.html       ├── login.html      ├── register.html
├── dashboard.html   ├── profile.html
├── report.html      ├── claims.html     ├── admin.html      (extra pages for this project's scope)
├── css/style.css
├── js/   common.js  home.js  login.js  register.js  report.js
│         dashboard.js  claims.js  admin.js  profile.js
└── img/             (to add: Git does not track empty folders, so commit it with a .gitkeep file)
```

Bootstrap 5.3.3 and Bootstrap Icons 1.11.3 are loaded from the jsDelivr CDN.

---

## 3. HTML pages and styling (Steps 3 and 4)

Every page follows the same structure: **navbar** (injected into `<div id="nav">`) → **main content** → **footer**.

**Bootstrap 5 features used**
- Responsive layout: `container`, `row`, `col-md-*`, `g-*` gutters
- `navbar` with a collapsing menu
- Cards: stat cards, item cards, auth cards
- Tables with `table-responsive`, badges for status, and pagination
- Modals: view/claim item, edit report, edit user
- Form controls: `form-control`, `form-select`, `form-check`, `btn-check` radio buttons, `form-text`
- Toast messages and alert boxes for feedback

---

## 4. Alignment with the ERD (what each form collects)

### Register (`register.html`) ↔ **Users**
| ERD field | Form field | Status |
|---|---|---|
| `fullName` | `name` | ✅ |
| `email` | `email` | ✅ |
| `password` | `password` (+ confirm) | ✅ |
| `idNumber`, `course`, `contactNumber` | | ❌ not collected yet |
| `role` | set by the system (default `user`) | ✅ |

### Report item (`report.html`) ↔ **Items**
| ERD field | Form field | Status |
|---|---|---|
| `itemName` | `title` | ✅ |
| `category` | `category` (dropdown) | ✅ |
| `description` | `description` | ✅ |
| `type` (lost/found) | `type` (radio buttons) | ✅ |
| `dateLostFound` | `dateOccurred` | ✅ |
| `locationId` | `location` (text) | ⚠️ text instead of a Locations lookup |
| `imageUrl` | `imageUrl` | ✅ |
| `reportedBy` | set from the logged-in user | ✅ |
| `status` | set by the system, editable in the edit modal | ✅ |
| `pin`, `storedAt` | | ❌ not in the form yet |
| *(extra)* | `contact` | ➕ |

### Claim (from the item view modal in `dashboard.html`) ↔ **Claims**
| ERD field | UI | Status |
|---|---|---|
| `itemId` | the selected item | ✅ |
| `claimantId` | logged-in user | ✅ |
| `proof` | message textarea | ✅ |
| `status` | shown as a badge in `claims.html`; admin approves/rejects | ✅ |
| `processedBy`, `processedAt` | | ❌ not shown yet |

### Profile (`profile.html`) ↔ **Users**
Shows name (editable), email and role (read-only), and an optional new password. This covers "Update Info" in the use case diagram.

### Use case diagram coverage
| Use case | Where |
|---|---|
| Log in | `login.html` |
| Place item | `report.html` |
| Update info | `profile.html` |
| Role: Admin manages | `admin.html`, claim review, edit/delete in `dashboard.html` |
| Role: Informant inquires | `dashboard.html` (search, filters), `claims.html` |
| Tracking status | status badges on items and claims |
| Inventory / Mini map / Staff role | ❌ not in the current `/frontend` |

---

## 5. API placeholders (Step 5)

- Forms use `action="#"` and `method="POST"` with `id` attributes on every field. The login, register and report forms also have `name` attributes matching the ERD-based field names.
- Each page has its own script in `/js/`, and `js/common.js` holds shared helpers (`api()` fetch wrapper, `Auth`, `renderNavbar`, `showToast`).
- **Note:** these scripts are already connected to the backend (`fetch` calls to `/api/...`) instead of being placeholders only. See `backend/README.md` for the endpoints.

---

## 6. Screenshots (Step 6)

Screenshots live in `/docs/lab11/`: login, register, index, dashboard, profile, report-item, items, item-details, claim, my-claims, manage-claims, manage-users, inventory and locations.

> The screenshots include pages (`items`, `item-details`, `my-claims`, `manage-claims`, `manage-users`, `inventory`, `locations`) that are **not** in the current `/frontend` folder. They show an earlier static version with the Staff/Admin menu, an inventory page with "Stored at", and a locations page. In the current build, these functions are merged into `dashboard.html`, `claims.html` and `admin.html`.

---

## 7. How to view the pages

Run the backend (`cd backend && npm install && npm start`) and open <http://localhost:3000>. The pages can also be opened with VS Code Live Server. The API base URL switches automatically to `http://localhost:3000/api`.
