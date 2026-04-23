# 💍 Eterné — Wedding & Event Planning Dashboard

A full-stack wedding and event planning application built with Node.js, Express, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)

### Installation

```bash
# Install dependencies
npm install

# Start the server (requires MongoDB running locally)
npm start

# For development with auto-reload
npm run dev
```

Open your browser at: **http://localhost:3000**

---

## 🔧 Configuration

Set these environment variables (or defaults are used):

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Server port |
| `MONGO_URI` | `mongodb://localhost:27017/weddingDB` | MongoDB connection string |
| `JWT_SECRET` | `weddingDB_secret_2024` | JWT signing secret |
| `SESSION_SECRET` | `wedding_session_secret` | Session secret |

### Using MongoDB Atlas (Cloud)
```bash
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/weddingDB npm start
```

---

## 📁 Project Structure

```
wedding-dashboard/
├── server.js              # Main Express server
├── models/
│   └── index.js           # Mongoose schemas (User, Event, Guest, Vendor, BudgetItem)
├── routes/
│   ├── auth.js            # Register / Login / Profile
│   ├── events.js          # Events CRUD + stats
│   ├── guests.js          # Guest list CRUD + filters
│   ├── vendors.js         # Vendors CRUD + filters
│   └── budget.js          # Budget items CRUD
├── middleware/
│   └── auth.js            # JWT authentication + token generation
└── public/
    └── index.html         # Full SPA frontend
```

---

## ✨ Features

### Frontend
- 🔐 **Login & Register** on the same page
- 📊 **Dashboard** with live stats
- 📅 **Events** — Create, edit, delete weddings/events
- 👥 **Guest List** — RSVP tracking, table assignments, dietary requirements
- 🏢 **Vendors** — Filter by type, city, price range, status
- 💰 **Budget Tracker** — Estimated vs actual spending

### Backend
- **JWT Authentication** with RBAC (admin/planner/client)
- **Express middleware** — cookie-parser, express-session, security headers
- **Express Validator** for input validation
- **Mongoose** with full CRUD + pagination-ready queries
- **Zlib compression** for large API responses
- **Node.js EventEmitter** for internal event logging
- **Error handling** with global middleware

---

## 🔌 API Endpoints

### Auth
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Sign in
- `GET /api/auth/profile` — Get current user

### Events
- `GET /api/events` — List all events
- `POST /api/events` — Create event
- `PUT /api/events/:id` — Update event
- `DELETE /api/events/:id` — Delete event + cascade
- `GET /api/events/:id/stats` — Event statistics

### Guests
- `GET /api/guests/event/:eventId` — List guests (with filters)
- `POST /api/guests` — Add guest
- `PUT /api/guests/:id` — Update guest
- `DELETE /api/guests/:id` — Remove guest

### Vendors
- `GET /api/vendors` — List vendors (filter by type/city/price/status)
- `POST /api/vendors` — Add vendor
- `PUT /api/vendors/:id` — Update vendor
- `DELETE /api/vendors/:id` — Remove vendor

### Budget
- `GET /api/budget/event/:eventId` — List budget items
- `POST /api/budget` — Add budget item
- `PUT /api/budget/:id` — Update item
- `DELETE /api/budget/:id` — Remove item
