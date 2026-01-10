# AI-Powered Smart Billing & Payment API (Backend Only)

Backend REST API with JWT auth, invoice management, simulated Easypaisa/JazzCash payments (HMAC checksums), and audit logs. No frontend is required.

## Project Layout (Clean/Layered)
```
src/
 ├── app.js            // Express app + middleware
 ├── server.js         // Startup + DB connect
 ├── config/           // env + db
 ├── models/           // Mongoose schemas (User, Invoice, Payment, AuditLog)
 ├── controllers/      // HTTP handlers only
 ├── services/         // Business logic
 ├── routes/           // Route registration
 ├── integrations/     // Payment mocks
 ├── middleware/       // auth, validation, errors
 ├── utils/            // logger, checksum helpers
 └── seed/             // seed script
```

## Prerequisites
- Node.js 18+ recommended
- MongoDB running locally (or connection string in `.env`)

## Quick Start
1) Install deps: `npm install`  
2) Env: copy `env.example` → `.env` and edit values  
3) Seed sample data (admin user + invoices): `npm run seed`  
4) Run dev server: `npm run dev` (default port 5000)  
   - Healthcheck: `GET /health`

## Environment Variables (`.env`)
- `PORT=5000`
- `MONGODB_URI=mongodb://localhost:27017/ai_smart_billing`
- `JWT_SECRET=supersecretjwt`
- `JWT_EXPIRES_IN=1d`
- `EASYPaisa_SECRET=easypaisa_checksum_secret`
- `JAZZCASH_SECRET=jazzcash_checksum_secret`
- `LOG_LEVEL=info`

## Auth & Roles
- Register/Login: `/api/auth/register`, `/api/auth/login`
- JWT header: `Authorization: Bearer <token>`
- Roles: `admin`, `user`  
  - Only admin can delete invoices.

## Core Endpoints (prefix `/api`)
- Auth: `POST /auth/register`, `POST /auth/login`
- Invoices (auth): `GET /invoices`, `GET /invoices/:id`, `GET /invoices/unpaid`, `POST /invoices`, `PATCH /invoices/:id/status`, `DELETE /invoices/:id` (admin)
- Payments:
  - Initiate (auth): `POST /payments/easypaisa/initiate`, `POST /payments/jazzcash/initiate`, `POST /payments/initiate`
  - Callbacks (no auth, simulate gateway): `POST /payments/easypaisa/callback`, `POST /payments/jazzcash/callback`, `POST /payments/callback`
  - List (auth): `GET /payments`

## Happy-Path Demo (cURL)
```bash
# login (seeded admin)
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}' | jq -r .token)

# create invoice
INV=$(curl -s -X POST http://localhost:5000/api/invoices \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"invoiceNumber":"INV-2001","customerName":"Acme","amount":1500,"dueDate":"2026-02-15"}' | jq -r ._id)

# initiate payment (Easypaisa)
INIT=$(curl -s -X POST http://localhost:5000/api/payments/easypaisa/initiate \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"invoiceId\":\"$INV\"}")
TXN=$(echo $INIT | jq -r .transactionId); CS=$(echo $INIT | jq -r .checksum)

# simulate gateway callback success
curl -s -X POST http://localhost:5000/api/payments/easypaisa/callback \
  -H "Content-Type: application/json" \
  -d "{\"transactionId\":\"$TXN\",\"status\":\"SUCCESS\",\"checksum\":\"$CS\",\"invoiceId\":\"$INV\",\"paymentMethod\":\"EASYPaisa\"}"
```

## Payment Simulation Notes
- Each initiate call returns `transactionId` and `checksum` (HMAC-SHA256).
- Callback verifies checksum per gateway secret; only then marks payment and sets invoice to `PAID` on success.

## Scripts
- `npm run dev` – start with nodemon
- `npm start` – start without nodemon
- `npm run seed` – seed admin + sample invoices

## Troubleshooting
- Ensure MongoDB is running and `MONGODB_URI` is correct.
- 401: check Bearer token.
- Callback checksum errors: use the checksum returned from the initiate step.