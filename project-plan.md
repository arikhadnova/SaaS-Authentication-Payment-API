# Project Plan — SaaS Authentication & Payment API

## 1. Project Overview

**Project Name:**
`SaaS Auth & Payment System`

**Goal:**
Membangun backend system yang merepresentasikan arsitektur aplikasi SaaS modern dengan fitur:

* Multi authentication (manual + OAuth)
* JWT authentication
* Payment gateway integration
* Webhook handling
* Transaction management
* API documentation
* Live deployment

Project ini ditujukan sebagai **portfolio backend engineer** yang menunjukkan kemampuan dalam membangun **production-style backend system**.

---

# 2. Core Features

## Authentication System

### Manual Authentication

* User Register
* User Login
* Password hashing
* JWT authentication
* Refresh token

### OAuth Authentication

Login menggunakan:

* Google
* GitHub

Flow:

```
User → OAuth Provider → Backend → JWT Token
```

### Security

* bcrypt password hashing
* JWT access token
* JWT refresh token
* protected routes

---

# 3. Payment System

Integrasi payment gateway.

Fitur:

* Create payment
* Payment checkout
* Webhook payment confirmation
* Update transaction status
* Transaction history

Payment lifecycle:

```
create transaction
        ↓
payment pending
        ↓
webhook confirmation
        ↓
update transaction status
```

Transaction status:

```
pending
success
failed
expired
```

---

# 4. User Dashboard (Frontend Demo)

Frontend hanya sebagai **demo interface** untuk menunjukkan API bekerja.

Fitur:

* Register
* Login
* OAuth login
* User dashboard
* Product list
* Checkout
* Transaction history

Frontend hanya minimal.

---

# 5. Tech Stack

## Backend

```
Node.js
Express.js
PostgreSQL
Prisma ORM
```

## Authentication

```
JWT
bcrypt
OAuth (Google + GitHub)
Passport.js
```

## Payment

```
Payment Gateway API
Webhook handler
Transaction verification
```

## API Documentation

```
Swagger
```

## Deployment

```
Backend → Cloud server
Database → Managed PostgreSQL
Frontend → Static hosting
```

---

# 6. Project Architecture

```
project-root
│
├── backend
│
│   ├── src
│   │
│   │   ├── controllers
│   │   │
│   │   ├── routes
│   │   │
│   │   ├── middleware
│   │   │
│   │   ├── services
│   │   │
│   │   ├── utils
│   │   │
│   │   └── config
│
│   ├── prisma
│   │
│   └── server.js
│
├── frontend
│
└── docs
```

Tujuan struktur ini:

* memisahkan business logic
* meningkatkan maintainability
* mengikuti clean backend architecture

---

# 7. Database Design

## Users

```
users
-----
id
email
password
provider
provider_id
created_at
```

provider:

```
local
google
github
```

---

## Products

```
products
--------
id
name
price
created_at
```

---

## Transactions

```
transactions
------------
id
user_id
product_id
status
payment_method
created_at
```

---

## Payments

```
payments
--------
id
transaction_id
gateway_reference
amount
status
created_at
```

---

# 8. API Endpoints

## Authentication

```
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/logout
```

OAuth:

```
GET /auth/google
GET /auth/google/callback

GET /auth/github
GET /auth/github/callback
```

---

## User

```
GET /users/profile
```

---

## Products

```
GET /products
POST /products
```

---

## Payment

```
POST /payment/create
POST /payment/webhook
GET  /payment/history
```

---

# 9. Development Phases

## Phase 1 — Project Setup

* Initialize backend project
* Setup Express server
* Setup PostgreSQL
* Setup Prisma ORM
* Basic folder structure

---

## Phase 2 — Authentication

* Register
* Login
* Password hashing
* JWT access token
* Refresh token
* Protected routes

---

## Phase 3 — OAuth Login

* Google login
* GitHub login
* OAuth callback handling
* Account linking

---

## Phase 4 — Payment Integration

* Create transaction
* Payment gateway integration
* Webhook endpoint
* Transaction verification

---

## Phase 5 — Frontend Demo

* Login page
* OAuth buttons
* Dashboard
* Checkout page
* Transaction history

---

## Phase 6 — API Documentation

* Swagger setup
* Endpoint documentation

---

## Phase 7 — Deployment

* Deploy backend
* Deploy database
* Deploy frontend
* Environment configuration

---

# 10. Portfolio Goals

Project ini dirancang untuk menunjukkan kemampuan dalam:

* Backend architecture
* Authentication system design
* OAuth integration
* Payment integration
* Webhook handling
* Database design
* API documentation
* Deployment

Target akhir:

```
Production-style backend portfolio project
```

yang dapat ditampilkan di:

* GitHub
* LinkedIn
* CV
