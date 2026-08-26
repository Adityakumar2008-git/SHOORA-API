# SHOORA AI — Technology Stack Specifications

This document defines the complete technical stack, libraries, cloud services, and framework components used across the SHOORA AI platform.

---

## 1. Frontend Technologies

| Component | Technology | Version / Spec | Description |
| :--- | :--- | :--- | :--- |
| **Core Structure** | HTML5 | Standard HTML5 | Semantic markup, responsive viewport layout |
| **Styling Engine** | Vanilla CSS3 | Custom CSS Tokens | Custom variable architecture (`desktop.css` & `mobile.css`) |
| **Typography** | Inter & Google Fonts | Google Fonts API | Clean, modern sans-serif typography |
| **Iconography** | FontAwesome Free | v6.4.0 CDN | Scalable vector icons |
| **Logic & State** | Modern Vanilla JS | ES6+ Modules | Async/await, fetch API, DOM manipulation |
| **Responsive Grid** | CSS Flexbox & Grid | Native CSS3 | Adaptive multi-column desktop & single-column mobile layouts |

---

## 2. Backend & Cloud Infrastructure (Firebase Ecosystem)

| Service | Component | Purpose |
| :--- | :--- | :--- |
| **Firebase Auth** | Identity Engine | Manages user sign-up, sign-in (Email/Password & Google OAuth), and ID tokens (JWT) |
| **Cloud Firestore** | NoSQL Database | Real-time database for customer key ownership (`users/{uid}/keys`), admin inventory (`inventory_vault`), and orders (`orders`) |
| **Firebase Cloud Functions** | Serverless Backend | Node.js environment executing server-side Razorpay order creation and HMAC SHA-256 signature verifier |
| **Firestore Security Rules** | Data Access Guard | Enforces strict path-level authorization (`request.auth.uid == userId`) preventing unauthorized key access |

---

## 3. Payment Gateway Integration

| Gateway | Component | Description |
| :--- | :--- | :--- |
| **Razorpay Standard Checkout** | Client SDK | Modal popup handling card, UPI, net banking, and wallet transactions in INR |
| **HMAC SHA-256 Verifier** | Server Function | Cryptographically verifies `razorpay_signature` using server secret key before fulfilling API key |

---

## 4. Key Security & Cryptography

| Security Area | Technology | Implementation |
| :--- | :--- | :--- |
| **Key Encryption** | AES-256-GCM | Encrypts raw API keys stored in database inventory vault |
| **Transit Security** | TLS 1.3 | HTTPS encrypted communication for all API calls |
| **Passcode Hashing** | bcrypt / PBKDF2 | Hashes admin passcode for secure portal authentication |
