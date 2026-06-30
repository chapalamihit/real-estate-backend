# 🏠 Real Estate Backend API

A production-ready REST API built with **Express.js** and **MongoDB** for a real estate platform.

---

## Tech Stack
- **Express.js** — web framework
- **MongoDB + Mongoose** — database & ODM
- **JWT** — authentication
- **Multer** — image uploads
- **bcryptjs** — password hashing
- **Helmet + CORS** — security

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# 3. Seed demo data (optional)
node seed.js

# 4. Start the server
npm run dev   # development (needs nodemon)
npm start     # production
```

---

## Project Structure

```
├── server.js              # Entry point
├── seed.js                # Demo data seeder
├── models/
│   ├── User.js            # User (buyer / seller / agent / admin)
│   ├── Property.js        # Property listing
│   └── Inquiry.js         # Contact inquiry
├── controllers/
│   ├── authController.js
│   ├── propertyController.js
│   ├── inquiryController.js
│   └── agentController.js
├── routes/
│   ├── auth.js
│   ├── properties.js
│   ├── inquiries.js
│   └── agents.js
├── middleware/
│   ├── auth.js            # JWT protect + role authorize
│   └── upload.js          # Multer image upload
└── uploads/               # Stored images
```

---

## API Endpoints

### Auth  `/api/auth`
| Method | Path            | Auth | Description          |
|--------|-----------------|------|----------------------|
| POST   | /register       | —    | Register new user    |
| POST   | /login          | —    | Login & get token    |
| GET    | /me             | ✅   | Get current user     |
| PUT    | /me             | ✅   | Update profile       |
| PUT    | /password       | ✅   | Change password      |
| POST   | /save/:id       | ✅   | Toggle saved property|

### Properties  `/api/properties`
| Method | Path       | Auth          | Description           |
|--------|------------|---------------|-----------------------|
| GET    | /          | —             | List / search / filter|
| GET    | /stats     | —             | Aggregated stats      |
| GET    | /:id       | —             | Single property       |
| POST   | /          | agent / admin | Create listing        |
| PUT    | /:id       | agent / admin | Update listing        |
| DELETE | /:id       | agent / admin | Delete listing        |

#### Query params for GET /api/properties
```
?type=house&status=for-sale&minPrice=200000&maxPrice=800000
&minBedrooms=2&city=Austin&featured=true&search=downtown
&page=1&limit=12&sort=-price
&lat=30.26&lng=-97.74&radius=10   ← nearby (km)
```

### Agents  `/api/agents`
| Method | Path  | Auth | Description                        |
|--------|-------|------|------------------------------------|
| GET    | /     | —    | All agents                         |
| GET    | /:id  | —    | Agent profile + their listings     |

### Inquiries  `/api/inquiries`
| Method | Path         | Auth          | Description            |
|--------|--------------|---------------|------------------------|
| POST   | /            | ✅            | Send inquiry           |
| GET    | /mine        | ✅            | My sent inquiries      |
| GET    | /agent       | agent / admin | Inquiries for my props |
| PUT    | /:id/reply   | agent / admin | Reply to inquiry       |

---

## User Roles
| Role  | Can do |
|-------|--------|
| buyer | Browse, save, inquire |
| seller | Browse, inquire |
| agent | All buyer actions + create/edit/delete own listings + reply to inquiries |
| admin | Full access |

---

## Example Requests

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"secret123","role":"buyer"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sarah@realty.com","password":"password123"}'
```

### Search Properties
```bash
curl "http://localhost:5000/api/properties?city=New York&type=apartment&maxPrice=600000"
```

### Create Listing (agent)
```bash
curl -X POST http://localhost:5000/api/properties \
  -H "Authorization: Bearer <TOKEN>" \
  -F "title=Sunny Loft" \
  -F "price=320000" \
  -F "type=apartment" \
  -F "bedrooms=1" \
  -F "bathrooms=1" \
  -F "area=750" \
  -F "address[street]=99 Park Blvd" \
  -F "address[city]=Brooklyn" \
  -F "address[state]=NY" \
  -F "address[zip]=11201" \
  -F "images=@/path/to/photo.jpg"
```

### Send Inquiry
```bash
curl -X POST http://localhost:5000/api/inquiries \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"property":"<PROPERTY_ID>","message":"Is this still available?","phone":"555-9999"}'
```
