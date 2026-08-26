# SHOORA AI — Technical Requirements & Non-Functional Specifications

This document outlines the technical requirements, non-functional constraints, performance benchmarks, and data schemas for the SHOORA AI platform.

---

## 1. Non-Functional Requirements

### 1.1 Security & Compliance
- **Mandatory Authentication**: No API Key checkout or purchase can execute without an authenticated Firebase user session (`request.auth.uid`).
- **Data Isolation**: Cloud Firestore Security Rules must enforce strict data boundaries (`request.auth.uid == userId`).
- **Key Vault Encryption**: Admin inventory keys must be encrypted with AES-256-GCM before writing to database.
- **Zero-Data Retention Policy**: Level 5 Sovereign Enterprise models guarantee zero prompt/response logging.
- **PCI-DSS & SSL**: Payment handling compliant with PCI-DSS via Razorpay hosted modal over TLS 1.3.

### 1.2 Performance Benchmarks
- **Page Load Time**: Initial DOM load under 1.5 seconds on 3G connections.
- **API Response Latency**: Core API gateway latency under 40ms.
- **Calculator Calculation Speed**: Sub-10ms real-time recalculation on selection change.

---

## 2. Cloud Firestore Database Schema Specs

### 2.1 User Profile & Keys Collection (`users/{uid}`)
```json
{
  "uid": "string (Firebase Auth UID)",
  "email": "string (User Email)",
  "displayName": "string (User Name)",
  "createdAt": "timestamp (Account Creation Date)"
}
```

#### Subcollection: `users/{uid}/keys/{keyId}`
```json
{
  "keyId": "string (Unique Key Document ID)",
  "apiKey": "string (sk_live_...)",
  "agent": "string (e.g. omni, code, legal, quant)",
  "model": "string (e.g. ultra, pro, lite)",
  "accuracy": "string (e.g. 1, 2, 3, 4, 5)",
  "usageLimit": "string (e.g. 10k, 50k, unlimited)",
  "purchaseDate": "timestamp",
  "paymentId": "string (razorpay_payment_id)",
  "status": "string ('active' | 'revoked')"
}
```

### 2.2 Admin Key Inventory Vault (`inventory_vault/{keyId}`)
```json
{
  "keyId": "string",
  "agent": "string",
  "model": "string",
  "accuracy": "string",
  "encryptedKey": "string (AES-256 Ciphertext)",
  "status": "string ('available' | 'assigned')",
  "addedAt": "timestamp"
}
```

### 2.3 Order Receipts Ledger (`orders/{orderId}`)
```json
{
  "orderId": "string (Razorpay Order ID)",
  "paymentId": "string (Razorpay Payment ID)",
  "uid": "string (Purchaser Auth UID)",
  "email": "string",
  "amountInPaisa": "number",
  "agent": "string",
  "model": "string",
  "assignedKey": "string",
  "timestamp": "timestamp"
}
```
