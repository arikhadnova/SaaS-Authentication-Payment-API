# database-schema.md

Database schema untuk project **SaaS Authentication + OAuth + Payment System**.

Tujuan desain schema ini:

* mendukung multi-authentication (local + OAuth)
* mendukung payment transaction
* scalable untuk fitur SaaS
* menjaga data integrity

Database yang digunakan: **PostgreSQL**

---

# 1. Entity Relationship Overview

Relasi utama sistem:

```text
User
 │
 │ 1..*
 ▼
Transaction
 │
 │ 1..1
 ▼
Payment
 │
 │
 ▼
Product
```

Relasi tambahan:

```text
User
 │
 ├── OAuthAccount
 │
 └── RefreshToken
```

---

# 2. Table: users

Menyimpan data user utama.

```sql
users
-----
id              uuid (PK)
email           varchar (unique)
password        varchar (nullable)
name            varchar
provider        varchar
created_at      timestamp
updated_at      timestamp
```

Penjelasan:

| Field    | Description                     |
| -------- | ------------------------------- |
| id       | primary key                     |
| email    | email user                      |
| password | hash password (null jika OAuth) |
| provider | jenis login                     |
| name     | nama user                       |

Nilai provider:

```text
local
google
github
```

Catatan:

Jika login OAuth, password bisa **NULL**.

---

# 3. Table: oauth_accounts

Digunakan untuk menyimpan akun OAuth provider.

```sql
oauth_accounts
--------------
id              uuid (PK)
user_id         uuid (FK users)
provider        varchar
provider_id     varchar
access_token    text
created_at      timestamp
```

Contoh data:

| provider | provider_id  |
| -------- | ------------ |
| google   | 103938384848 |
| github   | 928393939    |

Relasi:

```text
users 1 --- * oauth_accounts
```

Satu user bisa memiliki beberapa provider login.

---

# 4. Table: refresh_tokens

Digunakan untuk menyimpan refresh token.

```sql
refresh_tokens
--------------
id              uuid (PK)
user_id         uuid (FK users)
token           text
expires_at      timestamp
created_at      timestamp
```

Relasi:

```text
users 1 --- * refresh_tokens
```

Kenapa perlu disimpan?

* untuk logout
* untuk revoke token
* meningkatkan security

---

# 5. Table: products

Produk yang dapat dibeli user.

```sql
products
--------
id              uuid (PK)
name            varchar
description     text
price           integer
created_at      timestamp
```

Contoh:

| name         | price  |
| ------------ | ------ |
| Premium Plan | 100000 |
| Pro Plan     | 250000 |

---

# 6. Table: transactions

Menyimpan transaksi user.

```sql
transactions
------------
id              uuid (PK)
user_id         uuid (FK users)
product_id      uuid (FK products)
status          varchar
amount          integer
created_at      timestamp
updated_at      timestamp
```

Relasi:

```text
users 1 --- * transactions
products 1 --- * transactions
```

Status transaksi:

```text
pending
paid
failed
expired
```

---

# 7. Table: payments

Detail pembayaran dari gateway.

```sql
payments
--------
id                  uuid (PK)
transaction_id      uuid (FK transactions)
gateway             varchar
gateway_reference   varchar
payment_method      varchar
status              varchar
paid_at             timestamp
created_at          timestamp
```

Contoh gateway_reference:

```text
midtrans_order_id
stripe_payment_id
```

Relasi:

```text
transactions 1 --- 1 payments
```

---

# 8. Table: webhooks_log

Opsional tetapi sangat berguna untuk debugging.

```sql
webhooks_log
------------
id              uuid (PK)
event_type      varchar
payload         jsonb
created_at      timestamp
```

Digunakan untuk menyimpan event webhook dari payment gateway.

Contoh event:

```text
payment.success
payment.failed
payment.expired
```

---

# 9. Entity Relationship Diagram (Logical)

```text
users
 │
 ├── oauth_accounts
 │
 ├── refresh_tokens
 │
 └── transactions
        │
        ▼
     payments
        │
        ▼
      products
```

---

# 10. Database Index Recommendation

Index yang direkomendasikan:

```sql
CREATE INDEX idx_user_email ON users(email);

CREATE INDEX idx_transaction_user ON transactions(user_id);

CREATE INDEX idx_payment_transaction ON payments(transaction_id);

CREATE INDEX idx_oauth_provider ON oauth_accounts(provider, provider_id);
```

Tujuan index:

* mempercepat login
* mempercepat query transaksi
* mempercepat lookup OAuth

---

# 11. Security Considerations

Beberapa hal penting:

### Password

```text
bcrypt hash
```

### Token

Refresh token harus:

```text
random
long
expire
```

### OAuth

Simpan hanya data penting:

```text
provider_id
email
name
```

---

# 12. Future Extension

Schema ini mudah dikembangkan untuk:

### Subscription System

Tambahan table:

```text
subscriptions
plans
```

### Role Based Access

Tambahan field:

```text
users.role
```

### Admin Panel

Tambahan:

```text
admin_users
```

---

# 13. Migration Strategy

Menggunakan ORM migration.

Langkah:

```text
1. define schema
2. run migration
3. generate client
```

---

# 14. Summary

Database ini mendukung:

* multi authentication
* OAuth login
* payment integration
* transaction tracking
* webhook handling

Schema dirancang agar:

```text
scalable
secure
maintainable
```

dan cukup kuat untuk **production-style backend project**.
