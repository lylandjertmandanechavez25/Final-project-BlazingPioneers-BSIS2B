# Frontend – Lost & Found

Bootstrap 5 (CDN) + vanilla JavaScript `fetch()`. Served by the backend at http://localhost:3000, or open with VS Code **Live Server** (the API base URL switches automatically to `http://localhost:3000/api`).

| Page | Use case | Phase |
|---|---|---|
| index.html | Home, stats, recent items | 3, 5 |
| register.html / login.html | Register, login (validation + messages) | 3, 4 |
| report.html | Report lost/found item (POST) | 4 |
| dashboard.html | Browse, search, filter, paginate, view, claim, edit (modal), delete | 5, 6 |
| claims.html | Review, approve/reject, delete claims | 6 |
| admin.html | Admin user management (edit modal, delete) | 6 |
| profile.html | Update own profile | 3 |

Form fields map to the ERD (User: name/email/password; Item: title/type/category/location/dateOccurred/...; Claim: item/message).
