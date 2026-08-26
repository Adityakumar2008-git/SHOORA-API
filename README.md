#  SHOORA AI — Enterprise Multi-Agent API Platform

<div align="center">

![SHOORA AI Banner](assets/images/generated_images/ai_chip_circuit.png)

[![Platform](https://img.shields.io/badge/Platform-SHOORA%20AI%20API-1a73e8?style=for-the-badge&logo=google-cloud&logoColor=white)](https://github.com/Adityakumar2008-git/SHOORA-API)
[![Security](https://img.shields.io/badge/Security-Zero--Trust%20RBAC-10b981?style=for-the-badge&logo=shield&logoColor=white)](#-zero-trust-security-architecture)
[![Database](https://img.shields.io/badge/Database-Cloud%20Firestore-f59e0b?style=for-the-badge&logo=firebase&logoColor=white)](https://firebase.google.com)
[![Payments](https://img.shields.io/badge/Payments-Razorpay%20TLS%201.3-0284c7?style=for-the-badge&logo=razorpay&logoColor=white)](https://razorpay.com)
[![Uptime](https://img.shields.io/badge/SLA-99.99%25%20Guaranteed-8b5cf6?style=for-the-badge)](#-system-status--availability-matrix)

**Production-grade, high-scale artificial intelligence API ecosystem powering 21+ specialized autonomous agents, 5 foundation model backends, real-time dynamic pricing, and an in-memory zero-trust administrative command center.**

[Explore Docs](curriculum.html) • [API Pricing](pricing.html) • [System Status](status.html) • [Get API Key](register.html)

</div>

---

## 📖 Table of Contents
- [🌟 Platform Overview](#-platform-overview)
- [🛡️ Zero-Trust Security Architecture](#️-zero-trust-security-architecture)
- [⚡ Key Features & Modules](#-key-features--modules)
- [🏗️ Architectural Blueprint](#️-architectural-blueprint)
- [📊 Dynamic Pricing & Configuration Matrix](#-dynamic-pricing--configuration-matrix)
- [🗂️ Project Directory Structure](#️-project-directory-structure)
- [⚙️ Getting Started & Local Setup](#️-getting-started--local-setup)
- [🔒 Firestore Security Rules Deployment](#-firestore-security-rules-deployment)
- [📄 License & Authors](#-license--authors)

---

## 🌟 Platform Overview

**SHOORA AI** is an enterprise-grade Multi-Agent AI API gateway engineered for modern developers, fintech enterprises, healthcare researchers, legal teams, and autonomous software platforms.

### Core Capabilities:
- **21+ Specialized Autonomous Agents**: Omni-Generalist, Code Architect, Medical Literature Analyst, Legal Document Summarizer, Quant Financial Trader, Cybersecurity Auditor, Polyglot Translator, DevOps Automation, and more.
- **5 Multi-Modal Foundation Models**: Shoora-Ultra Max (1.5M Context), Shoora-Pro v4, Shoora-Lite v2, Shoora-Vision Pro, and Shoora-Code Specialist.
- **5-Tier Fine-Tuning Precision**: From Level 1 (Base Domain) up to Level 5 (Sovereign 100% Precision Enterprise Fine-Tuning).
- **Strict Inventory Stock-Gating**: Dynamic purchasing pipeline that only sells configurations actively stocked by administrators.
- **Real-Time Per-API Segregated Analytics**: Real-time telemetry tracking request quotas, latency, error distributions, and usage history segregated per API key.

---

## 🛡️ Zero-Trust Security Architecture

1. **Google Cryptographic JWT Session Tokens (RSA-256)**:
   - Client-side tampering in browser DevTools cannot forge Google RSA-256 digital signatures.
2. **Server-Side Isolation (`firestore.rules`)**:
   - Customer account data and API keys are strictly sandboxed (`request.auth.uid == userId`). Cross-account leakage is cryptographically impossible.
3. **Zero-Trust Anti-Reconnaissance Admin Portal (`admin.html`)**:
   - **Zero Pre-Rendered DOM**: Initial page HTML contains **zero admin tables, zero user records, and zero API keys**.
   - **In-Memory Dynamic DOM**: Admin UI is generated inside memory only upon entering the cryptographic master passcode.
   - **Anti-DevTools Shield**: Intercepts right-click, F12, and inspect shortcuts; auto-scrubs memory on portal lock.
   - **Brute-Force Rate Limiter**: 15-minute complete security lockout after 3 consecutive wrong attempts.
4. **Cryptographic Payment Integrity**:
   - Razorpay PCI-DSS compliant checkout with server-side HMAC SHA-256 signature verification preventing price alteration.

---

## ⚡ Key Features & Modules

### 1. 🔑 Dynamic Multi-Step Key Wizard (`register.html`)
- Real-time stock-gatekeeper displaying `🟢 In Stock (N Available)` or `🔴 Out of Stock / Restocking`.
- Mathematical dynamic price calculation based on agent, backend foundation model, accuracy tier, and rate limit.
- One-click checkout with automated key delivery modal and clipboard copying.

### 2. 📈 Customer Analytics Dashboard (`dashboard.html`)
- Segregated per-API key statistics (Total Calls, Average Latency, Success Rate, Quota Consumed).
- Key masking / unmasking with toggleable eye icons.
- Direct quick-links to integration documentation and code recipes.

### 3. 🛡️ Command Center & Key Vault (`admin.html`)
- **Tab 1 (Configuration Stocking)**: Single key ingest & 1-click bulk auto-generator (+5, +10 keys) with 256-bit crypto strings (`sk_live_shoora_[hex]`).
- **Tab 2 (Purchased Keys Directory)**: Live management of all user-owned keys with revoke, suspend, and quota modification controls.
- **Tab 3 (Customer Accounts Vault)**: Registered customer directory synced directly with Cloud Firestore.
- **Tab 4 (Orders & Revenue Ledger)**: Live financial transactions with **1-Click CSV and JSON data export**.
- **Tab 5 (Security Audit Trail)**: Immutable event log with timestamp, operator signature, and SHA-256 checksums.
- **Tab 6 (Global Gateway Controls)**: API Gateway Operational/Maintenance circuit breaker, passcode rotation, and database resync tools.

### 4. 📊 Live System Status & Stock Matrix (`status.html`)
- Public real-time SLA uptime monitor (99.99% guaranteed).
- Live inventory availability matrix across all 21 Agent categories and foundation models.

---

## 🏗️ Architectural Blueprint

| Tier | Component | Technology | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend** | Responsive UI / UX | Semantic HTML5, CSS3, Vanilla JS | Multi-device responsive interface with dynamic glowing Bento grid and micro-interactions |
| **Auth** | Identity Provider | Firebase Auth / Google OAuth | Decentralized cryptographic authentication with JWT session management |
| **Database** | Distributed NoSQL | Google Cloud Firestore | Ultra-low latency document store with sub-collection key isolation |
| **Payments** | Payment Gateway | Razorpay Standard Checkout | Card, UPI, Net Banking, and wallet transaction processing with TLS 1.3 |
| **Security** | Access Control | Firestore Security Rules | Server-side RBAC and tenant data isolation |

---

## 📊 Dynamic Pricing & Configuration Matrix

$$\text{Price (₹)} = \text{BasePrice}(\text{Agent}) \times \text{Mult}(\text{Model}) \times \text{Mult}(\text{Accuracy}) \times \text{Mult}(\text{Usage})$$

### Foundation Models:
| Model Name | Mult | Description |
| :--- | :---: | :--- |
| **Shoora-Lite v2** | `1.0x` | Low-latency turbo execution engine |
| **Shoora-Pro v4** | `1.4x` | High-speed balanced enterprise model |
| **Shoora-Vision Pro** | `1.6x` | Multimodal visual and document OCR engine |
| **Shoora-Code Specialist** | `1.7x` | Deep algorithmic logic and AST parser |
| **Shoora-Ultra Max** | `2.0x` | SOTA 1.5M context window reasoning cluster |

---

## 🗂️ Project Directory Structure

```
SHOORA-API/
├── index.html                  # Main Landing Page & Hero
├── pricing.html                # Dynamic Pricing Engine & Calculator
├── register.html               # Multi-Step API Wizard & Payment Modal
├── dashboard.html              # Customer Analytics & Key Management
├── status.html                 # Live Service Status & Stock Matrix
├── curriculum.html             # Developer Documentation & Endpoints
├── use-cases.html              # Enterprise AI Case Studies
├── login.html                  # Google OAuth & Email Authentication
├── about.html                  # Company Vision & Core Architecture
├── support.html                # Enterprise Support & Ticketing
├── privacy.html                # Data Privacy & GDPR/HIPAA Policies
├── admin.html                  # Zero-Trust Admin Command Center
├── script.js                   # Client Logic, Pricing & Stock Gate
├── desktop.css                 # Desktop Responsive Stylesheet
├── mobile.css                  # Mobile-First Optimized Stylesheet
├── index.css                   # Core Design Tokens & Theme Variables
├── firestore.rules             # Production Cloud Security Rules
├── firebase.json               # Hosting Config & HTTP Security Headers
├── README.md                   # Complete Platform Documentation
└── js/
    └── firebase-config.js      # Firebase Modular/Compat Integration
```

---

## ⚙️ Getting Started & Local Setup

### 1. Clone Repository:
```bash
git clone https://github.com/Adityakumar2008-git/SHOORA-API.git
cd SHOORA-API
```

### 2. Launch Local Dev Server:
```bash
# Using Python
python -m http.server 8080

# Or using Node.js
npx serve -l 8080 .
```

Access the application in your browser at:
`http://localhost:8080`

---

## 🔒 Firestore Security Rules Deployment

To enforce server-side data isolation, deploy the security rules to your Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // 1. User Profiles & Keys Vault (Strict Per-User Ownership)
    match /users/{userId} {
      allow read, write: if request.auth != null && (request.auth.uid == userId || request.auth.token.admin == true);
      
      match /keys/{keyId} {
        allow read, write: if request.auth != null && (request.auth.uid == userId || request.auth.token.admin == true);
      }
    }
    
    // 2. Admin Key Inventory Vault
    match /inventory_vault/{keyId} {
      allow read: if true;
      allow create, delete: if request.auth != null && request.auth.token.admin == true;
      allow update: if request.auth != null;
    }
    
    // 3. Purchase Order Ledger
    match /orders/{orderId} {
      allow read: if request.auth != null && (resource.data.uid == request.auth.uid || request.auth.token.admin == true);
      allow create: if request.auth != null;
    }

    // 4. Security Audit Logs
    match /audit_logs/{logId} {
      allow read, create: if request.auth != null && request.auth.token.admin == true;
    }

    // 5. Global System Settings
    match /system_settings/{settingId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

Deploy via Firebase CLI:
```bash
firebase deploy --only firestore:rules,hosting
```

---

## 📄 License & Authors

Developed by **[Aditya Choudhary](https://github.com/Adityakumar2008-git)** for **SHOORA AI API Platform**.

All rights reserved © 2026 SHOORA AI Inc. Licensed under the [MIT License](LICENSE).
