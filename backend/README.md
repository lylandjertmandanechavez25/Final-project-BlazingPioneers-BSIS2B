# iBULFAS - Integrated BicolU Lost and Found Automated System

Group 4 - Blazing Pioneers (BSIS 2B)

## What was implemented this week (Phase 3: Frontend)

HTML, CSS, and Bootstrap 5 pages for all user roles. Forms are placeholders
(`action="#"`) with sample scripts in `/frontend/js/`; API connection will be
added during backend integration.

| Page | Purpose |
|---|---|
| `index.html` | Landing page |
| `login.html`, `register.html` | Account access and profiling |
| `dashboard.html` | Overview per role |
| `profile.html` | View and update user info |
| `report-item.html` | Report a lost or found item (with mini map pin and photo) |
| `items.html` | Browse and filter items |
| `item-details.html` | Item details, map pin, and Claim button |
| `claim.html` | File a claim with proof of ownership |
| `my-claims.html` | Tracking status of reports and claims |
| `inventory.html` | Staff/Admin: items kept in the office |
| `manage-claims.html` | Staff/Admin: approve or reject claims |
| `manage-users.html` | Admin: manage users and roles |
| `locations.html` | Campus map and list of locations |


## How it aligns with the use case and ERD

**User roles (use case):** Admin, Staff, and Informant.

- **Users** (`idNumber`, `fullName`, `email`, `password`, `course`, `contactNumber`, `role`):
  `register.html`, `profile.html`, `manage-users.html`
- **Items** (`itemName`, `description`, `category`, `type`, `status`, `imageUrl`,
  `locationId`, `pin`, `storedAt`, `dateLostFound`):
  `report-item.html`, `items.html`, `item-details.html`, `inventory.html`
- **Claims** (`itemId`, `proof`, `claimDate`, `status`, `processedBy`, `processedAt`):
  `claim.html`, `my-claims.html`, `manage-claims.html`
- **Locations** (`name`, `building`, `coordinates`): `locations.html` and the
  location dropdown and mini map in `report-item.html`

**Key features (proposal):** Profiling System, Reporting, Claiming, Inventory,
Tracking Status, and Mini Map.

## Tech
HTML5, CSS3, Bootstrap 5 (CDN), JavaScript, Leaflet.js (OpenStreetMap)


