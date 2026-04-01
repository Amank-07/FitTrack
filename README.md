# FinTrack Backend

## Overview

FinTrack Backend is a role-based financial data processing system designed to manage transactions and provide analytical insights for a finance dashboard.

It allows users to create and manage financial records (income/expense), apply filters, and view aggregated analytics such as total income, expenses, category-wise breakdowns, and monthly trends. The system enforces role-based access control (RBAC) to ensure secure and restricted operations.

---

## Tech Stack

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* Jest + Supertest + mongodb-memory-server (Testing)

---

## Quick Start

```bash
git clone <your-repo-url>
cd fintrack-backend
npm install
cp .env.example .env
npm run dev
```

Server runs at:
http://localhost:5000

---

## Project Structure

Under `src/`:

* **controllers/** → Handles request/response (thin layer)
* **services/** → Business logic and database operations
* **models/** → Mongoose schemas (User, FinancialRecord)
* **routes/** → API route definitions
* **middleware/** → Auth, RBAC, validation, error handling
* **utils/** → Helpers (ApiError, asyncHandler)
* **config/** → DB connection and logger
* **app.js** → Express app configuration

Entry point: `server.js`

---

## Core Modules

### 🔐 Auth (`/api/auth`)

* Register user
* Login user
* Password hashing using bcryptjs
* JWT token generation

---

### 👤 Users (`/api/users`)

* Admin-only access
* Create, list, update, delete users
* Roles: `viewer`, `analyst`, `admin`
* Status: `active`, `inactive`

---

### 💰 Financial Records (`/api/records`)

* Create, read, update, delete records
* Fields:

  * amount
  * type (income / expense)
  * category
  * date
  * notes
  * userId
* Soft delete using `isDeleted`
* Filtering:

  * type
  * category
  * date range
* Pagination:

  * `page`, `limit`

---

### 📊 Dashboard (`/api/dashboard`)

* **Summary**

  * Total income
  * Total expense
  * Net balance
* **Category-wise aggregation**
* **Monthly trends**

---

## Role-Based Access Control (RBAC)

* **Viewer**

  * Can only view financial records

* **Analyst**

  * Can view records
  * Can create/update records
  * Can access analytics/dashboard

* **Admin**

  * Full access
  * Manage users + records + analytics

Implemented using:

* `authMiddleware` → JWT verification + active user check
* `roleMiddleware` → Role-based route protection

---

## Validation and Error Handling

* Request validation middleware for inputs
* Centralized error handling
* Proper HTTP status codes:

  * 200 → Success
  * 201 → Created
  * 400 → Bad Request
  * 401 → Unauthorized
  * 403 → Forbidden
  * 404 → Not Found

---

## Database Design

### User Schema

* name, email, password
* role (viewer, analyst, admin)
* status (active, inactive)
* timestamps

### FinancialRecord Schema

* amount, type, category, date, notes
* userId reference
* soft delete (`isDeleted`)
* timestamps

### Indexes

* `date`
* `category`
* `userId + date` (optimized queries)

---

## API Endpoints

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`

### Users (Admin Only)

* `POST /api/users`
* `GET /api/users`
* `GET /api/users/:id`
* `PATCH /api/users/:id`
* `DELETE /api/users/:id`

### Records

* `POST /api/records` (analyst/admin)
* `GET /api/records` (all roles)
* `GET /api/records/:id`
* `PATCH /api/records/:id` (analyst/admin)
* `DELETE /api/records/:id` (admin)

### Dashboard

* `GET /api/dashboard/summary`
* `GET /api/dashboard/category-wise`
* `GET /api/dashboard/monthly-trends`

---

## Query Parameters (Records)

* `type=income|expense`
* `category=<string>`
* `startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
* `page=1&limit=10`
* `userId=<id>` (admin only)

---

## Sample Response (Dashboard Summary)

```json
{
  "totalIncome": 52000,
  "totalExpense": 8000,
  "netBalance": 44000
}
```

---

## Testing

Integration tests included using Jest and Supertest.

Covers:

* Health endpoint
* Register/Login
* Invalid login cases
* Record creation, listing, filtering
* Dashboard summary
* RBAC enforcement

Run tests:

```bash
npm test
```

---

## Assumptions

* Each financial record belongs to one user
* Categories are flexible (user-defined)
* Dates are stored in ISO format
* Soft delete is used instead of permanent deletion

---

## Future Improvements

* Pagination enhancements
* Swagger API documentation
* Deployment (Render / Railway)
* Rate limiting
* Advanced analytics

---
