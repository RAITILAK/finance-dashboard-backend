<img width="1919" height="939" alt="Screenshot 2026-04-03 192352" src="https://github.com/user-attachments/assets/38cdeb33-77b0-42ef-8641-3724df3ef04a" />
<img width="1919" height="936" alt="Screenshot 2026-04-03 192342" src="https://github.com/user-attachments/assets/a212c7cf-9dbc-4c0d-aa27-4341e603f403" />
<img width="1899" height="942" alt="Screenshot 2026-04-03 192329" src="https://github.com/user-attachments/assets/2c6967c2-35b7-41f8-96b5-d02cb6fe1ce5" />
# 💹 FinDash — Finance Dashboard Backend

A full-stack finance dashboard system built with the MERN stack (MongoDB, Express, React, Node.js), featuring role-based access control, financial records management, and analytics APIs.

---

## 🚀 Tech Stack

| Layer    | Technology                                 |
| -------- | ------------------------------------------ |
| Frontend | React 19, React Router v7, Recharts, Axios |
| Backend  | Node.js, Express.js (ES Modules)           |
| Database | MongoDB Atlas + Mongoose ODM               |
| Auth     | JWT (JSON Web Tokens) + bcryptjs           |

---

## 👥 Role System

| Role    | Dashboard Stats | Charts | Transactions | Add/Edit/Delete | Users |
| ------- | :-------------: | :----: | :----------: | :-------------: | :---: |
| Viewer  |       ❌        |   ❌   |  View only   |       ❌        |  ❌   |
| Analyst |       ✅        |   ✅   |  View only   |       ❌        |  ❌   |
| Admin   |       ✅        |   ✅   |      ✅      |       ✅        |  ✅   |

---

## ⚙️ Local Setup

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (free tier) or local MongoDB

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd finance-dashboard
```

### 2. Install all dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `server/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

### 4. Seed the database

```bash
cd server
npm run seed
```

This creates 3 demo users and 40 sample transactions.

### 5. Run the app

Open two terminals:

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm start
```

App runs at: `http://localhost:3000`
API runs at: `http://localhost:5000`

---

## 🔐 Demo Accounts

| Role    | Email            | Password    |
| ------- | ---------------- | ----------- |
| Admin   | admin@demo.com   | password123 |
| Analyst | analyst@demo.com | password123 |
| Viewer  | viewer@demo.com  | password123 |

---

## 📡 API Endpoints

### Auth

| Method | Endpoint           | Access | Description        |
| ------ | ------------------ | ------ | ------------------ |
| POST   | /api/auth/register | Public | Create new account |
| POST   | /api/auth/login    | Public | Login, returns JWT |
| GET    | /api/auth/me       | All    | Get current user   |

### Users

| Method | Endpoint              | Access | Description         |
| ------ | --------------------- | ------ | ------------------- |
| GET    | /api/users            | Admin  | List all users      |
| PATCH  | /api/users/:id/role   | Admin  | Update user role    |
| PATCH  | /api/users/:id/status | Admin  | Activate/deactivate |

### Transactions

| Method | Endpoint              | Access    | Description                    |
| ------ | --------------------- | --------- | ------------------------------ |
| GET    | /api/transactions     | All roles | List with filters + pagination |
| POST   | /api/transactions     | Admin     | Create new transaction         |
| PUT    | /api/transactions/:id | Admin     | Update transaction             |
| DELETE | /api/transactions/:id | Admin     | Soft delete transaction        |

**Query filters for GET /api/transactions:**

```
?type=income|expense
?category=Salary
?from=2024-01-01
?to=2024-12-31
?page=1&limit=10
```

### Dashboard

| Method | Endpoint                   | Access         | Description                    |
| ------ | -------------------------- | -------------- | ------------------------------ |
| GET    | /api/dashboard/summary     | Admin, Analyst | Total income, expense, balance |
| GET    | /api/dashboard/by-category | Admin, Analyst | Totals grouped by category     |
| GET    | /api/dashboard/trends      | Admin, Analyst | Monthly income vs expense      |
| GET    | /api/dashboard/recent      | All roles      | Last 8 transactions            |

---

## 🏗️ Project Structure

```
finance-dashboard/
├── server/
│   └── src/
│       ├── config/         → MongoDB connection
│       ├── controllers/    → Route handlers
│       │   ├── authController.js
│       │   ├── userController.js
│       │   ├── transactionController.js
│       │   └── dashboardController.js
│       ├── middleware/     → JWT auth + role guard
│       ├── models/         → Mongoose schemas (User, Transaction)
│       ├── routes/         → Express routers
│       └── utils/          → Seed script
├── client/
│   └── src/
│       ├── context/        → Auth context (global state)
│       ├── services/       → Axios API config
│       ├── pages/          → Login, Register, Dashboard, Transactions, Users
│       └── components/     → Layout, Sidebar
└── README.md
```

---

## 🔒 Security Design

- Passwords hashed with **bcryptjs** (salt rounds: 10)
- JWT tokens expire in **7 days**
- All protected routes require `Authorization: Bearer <token>` header
- Role guard middleware checks permissions before every sensitive operation
- **Soft delete** — transactions are flagged `isDeleted: true`, never permanently removed
- Inactive users cannot log in even with correct credentials

---

## 💡 Assumptions Made

1. **Role assignment on register** — In a real system, role would be assigned by an admin only. For demo purposes, role can be selected during registration.
2. **Soft delete only** — Transactions are never permanently deleted to preserve financial audit trail.
3. **Single currency** — All amounts are treated as INR (₹) with no multi-currency support.
4. **No file uploads** — Receipt/document attachments are out of scope.
5. **Services folder** — Created for separation of concerns. In a larger system, business logic (especially aggregations) would be moved from controllers into dedicated service files.

---

## 🔮 What I'd Add With More Time

- [ ] Refresh token mechanism
- [ ] Export transactions to CSV/PDF
- [ ] Email notifications for large transactions
- [ ] Unit tests with Jest + Supertest
- [ ] Rate limiting per user (not just global)
- [ ] Multi-currency support
- [ ] Transaction receipt file uploads

---

## 👤 Author

**Tilak Rai**
Built as part of backend internship assignment — Zorvyn FinTech

```

---

## 🎯Final submission checklist:
```

✅ Backend — Express + MongoDB + JWT + RBAC
✅ 3 roles — viewer, analyst, admin
✅ Auth — register, login, protected routes
✅ Transactions — CRUD + filters + pagination + soft delete
✅ Dashboard — summary, trends, category breakdown, recent
✅ Users — role + status management (admin only)
✅ Frontend — React with charts, forms, role-aware UI
✅ Seed data — 3 users + 40 transactions
✅ README — setup, API docs, assumptions, structure
