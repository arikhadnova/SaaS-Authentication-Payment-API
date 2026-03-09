# system-architecture.md

System architecture untuk project **SaaS Authentication + OAuth + Payment Backend**.

Dokumen ini menjelaskan **bagaimana komponen sistem saling berinteraksi**, alur request, dan pembagian layer backend.

Tujuan desain:

* scalable
* maintainable
* production-style backend
* mudah dikembangkan

---

# 1. High Level Architecture

Arsitektur sistem secara umum:

```text
Client (Frontend / API Consumer)
            │
            ▼
        REST API
        (Express)
            │
 ┌──────────┼──────────┐
 │          │          │
 ▼          ▼          ▼
Auth     Payment     Product
Service  Service     Service
 │          │
 ▼          ▼
OAuth     Payment Gateway
Provider
 │
 ▼
Database (PostgreSQL)
```

Komponen utama sistem:

* Client
* Backend API
* Database
* OAuth provider
* Payment gateway

---

# 2. System Components

## Client

Client dapat berupa:

* web frontend
* mobile app
* API testing tools

Client hanya berinteraksi dengan backend melalui **REST API**.

---

## Backend API

Backend bertanggung jawab untuk:

* authentication
* authorization
* business logic
* database access
* external integration

Framework:

* Node.js
* Express

---

## Database

Database menyimpan:

* users
* oauth accounts
* refresh tokens
* products
* transactions
* payments

Database engine:

PostgreSQL.

---

## OAuth Providers

Digunakan untuk login social.

Provider yang digunakan:

* Google
* GitHub

Backend akan melakukan:

```text
OAuth redirect
token exchange
profile retrieval
user creation
JWT generation
```

---

## Payment Gateway

Payment gateway bertugas memproses pembayaran.

Backend akan:

```text
create payment request
receive webhook event
verify payment status
update transaction
```

---

# 3. Backend Layer Architecture

Backend dibagi menjadi beberapa layer.

```text
Routes
  │
  ▼
Controllers
  │
  ▼
Services
  │
  ▼
Repositories / ORM
  │
  ▼
Database
```

---

## Routes Layer

Bertanggung jawab untuk:

* mendefinisikan endpoint API
* mapping endpoint ke controller

Contoh:

```text
POST /auth/login
POST /payment/create
GET  /products
```

---

## Controller Layer

Controller bertugas:

* menerima request
* memanggil service
* mengembalikan response

Controller tidak boleh berisi business logic kompleks.

---

## Service Layer

Service berisi **business logic utama**.

Contoh:

Auth service:

```text
register user
login user
generate JWT
verify OAuth user
```

Payment service:

```text
create transaction
verify payment
update status
```

---

## Repository / ORM Layer

Layer ini bertugas:

* berinteraksi dengan database
* menjalankan query
* mapping data ke model

ORM yang digunakan:

Prisma.

---

# 4. Authentication Flow

## Manual Login

```text
Client
   │
   ▼
POST /auth/login
   │
   ▼
Controller
   │
   ▼
Auth Service
   │
   ├─ find user
   ├─ verify password
   └─ generate JWT
   │
   ▼
Response (Access Token + Refresh Token)
```

---

## Protected Route

```text
Client
   │
   ▼
Request API
   │
Authorization: Bearer token
   │
   ▼
Auth Middleware
   │
verify JWT
   │
   ▼
Controller
   │
   ▼
Response
```

---

# 5. OAuth Authentication Flow

OAuth login flow:

```text
Client
   │
   ▼
GET /auth/google
   │
   ▼
Redirect to OAuth provider
   │
   ▼
User login
   │
   ▼
OAuth provider redirect
   │
   ▼
Backend callback
   │
   ▼
Exchange code → access token
   │
   ▼
Fetch user profile
   │
   ▼
Create or find user
   │
   ▼
Generate JWT
   │
   ▼
Redirect to frontend
```

---

# 6. Payment Flow

Payment checkout flow:

```text
Client
   │
   ▼
POST /payment/create
   │
   ▼
Payment Service
   │
create transaction
   │
   ▼
Call Payment Gateway API
   │
   ▼
Return payment URL / token
   │
   ▼
Client redirect to payment page
```

---

# 7. Payment Webhook Flow

Webhook digunakan untuk konfirmasi pembayaran.

```text
Payment Gateway
      │
      ▼
POST /payment/webhook
      │
      ▼
Webhook Controller
      │
      ▼
Verify webhook signature
      │
      ▼
Update transaction status
      │
      ▼
Save payment record
```

---

# 8. Transaction Lifecycle

Status transaksi berubah sesuai event.

```text
created
   │
   ▼
pending
   │
   ├── success
   │
   ├── failed
   │
   └── expired
```

Setiap perubahan status harus disimpan dalam database.

---

# 9. Security Architecture

Beberapa lapisan keamanan:

### Password Security

Password disimpan menggunakan hashing.

```text
bcrypt
```

---

### Token Security

Token digunakan untuk authentication.

```text
Access Token
Refresh Token
```

Access token memiliki masa berlaku pendek.

---

### Webhook Verification

Webhook harus diverifikasi.

Tujuan:

```text
mencegah spoofing
mencegah request palsu
```

---

# 10. Error Handling Strategy

Semua API harus menggunakan struktur error yang konsisten.

Contoh response:

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

# 11. Logging Strategy

Logging penting untuk debugging.

Jenis log:

```text
auth logs
payment logs
webhook logs
error logs
```

Logging dapat disimpan di:

* console
* file
* logging service

---

# 12. Scalability Considerations

Arsitektur ini mendukung pengembangan lebih lanjut:

Tambahan service:

```text
notification service
subscription service
analytics service
```

Database juga dapat dipisah jika sistem berkembang.

---

# 13. Deployment Architecture

Deployment sederhana:

```text
Frontend
   │
   ▼
Hosting Platform
   │
   ▼
Backend API Server
   │
   ▼
PostgreSQL Database
```

Environment variables digunakan untuk menyimpan:

* JWT secret
* OAuth credentials
* payment gateway keys

---

# 14. Summary

Arsitektur sistem ini mendukung:

* manual authentication
* OAuth authentication
* payment integration
* webhook processing
* modular backend structure

Dengan pendekatan ini, project akan terlihat seperti:

```text
production-ready backend system
```

yang cocok untuk **portfolio backend engineer**.
