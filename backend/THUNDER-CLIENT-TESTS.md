# Thunder Client test order (base URL http://localhost:3000)

1. GET  /                          -> {"message":"Lost & Found API is running"}
2. POST /api/users/register        body: {"name":"Juan","email":"juan@test.com","password":"123456"}
3. POST /api/users/login           body: {"email":"juan@test.com","password":"123456"}  -> copy "token"
4. For protected routes: Auth tab -> Bearer -> paste token
5. GET  /api/users/me
6. (Make admin once in MongoDB Compass: users collection -> set role to "admin", then log in again)
7. POST /api/categories            body: {"name":"Electronics"}   (admin/staff token)
8. GET  /api/categories            -> copy a category _id
9. POST /api/items                 body: {"title":"Black umbrella","description":"Folding","type":"lost","category":"<categoryId>","location":"Library","dateLostOrFound":"2026-11-10"}
10. GET /api/items
11. POST /api/claims               body: {"item":"<itemId>","proofDescription":"Has my initials"}
12. PUT  /api/claims/<claimId>/review   body: {"status":"approved","remarks":"Verified"}  (admin/staff token)
13. GET /api/notifications
