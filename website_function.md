# SHOORA AI — Website Functional Specifications

This document outlines the detailed functional specification for every page and interactive component across the SHOORA AI platform.

---

## 1. Public Pages Specification

### 1.1 Home / Landing Page (`index.html`)
- **Hero Banner**: Highlights Multi-Agent AI Platform capabilities with direct CTAs to `register.html` and `pricing.html`.
- **Global Influence Bento Grid**: Displays SLA Uptime (99.99%), Latency metrics (<40ms), and 20+ Trained Agents counters.
- **Code Terminal Widget**: Demonstrates REST API request payloads to `/v1/agent/execute` with syntax highlighting.
- **Dynamic Navbar**: Displays `Login / Sign Up` when logged out, and automatically switches to `Dashboard` when authenticated.

### 1.2 Interactive Pricing Matrix (`pricing.html`)
- **Dynamic API Matrix Calculator Widget**:
  - **Selector 1**: 20 Specialized AI Agents + 1 Omni-Generalist Super Agent.
  - **Selector 2**: 5 Foundation Models (Lite v2, Pro v4, Ultra Max 1.5M, Vision Pro, Code Specialist).
  - **Selector 3**: 5 Fine-Tuning & Accuracy Levels (Level 1 Base to Level 5 Sovereign).
  - **Selector 4**: 5 Daily Usage Capacity Limits (1,000 req/day to Unlimited Enterprise).
  - **Live Price Display**: Instant real-time calculation in INR (`₹X,XXX`).
- **Capability & SLA Matrix Table**: Comparative table listing Latency SLAs, Encryption, and Support Tiers.
- **Old Pricing Cards Removal**: Completely free of old hardcoded static pricing cards.

### 1.3 Custom API Registration Wizard (`register.html`)
- **Step 1 (Personal Details)**: Full Name, Email Address, Mobile Number.
- **Step 2 (Use Case)**: Organization, Primary Application Domain.
- **Step 3 (API Configuration)**: Dropdowns for Agent Type, Foundation Model, Accuracy Level, and Daily Limit with live price preview.
- **Step 4 (Checkout & Order Summary)**: Displays itemized summary and Pay Securely via Razorpay button.
- **Auth Guard**: Clicking Pay without an active account redirects to `login.html`.

### 1.4 Authentication Portal (`login.html`)
- **Tabs**: Sign In & Create Account.
- **Authentication Providers**: Email/Password authentication & Google 1-Click Sign-In.
- **Redirect Handling**: Seamless redirect back to checkout/register flow after authentication.

---

## 2. Customer & Admin Portals

### 2.1 Customer Account Dashboard (`dashboard.html`)
- **Auth Protection**: Protected page requiring active Firebase Auth session.
- **My Owned API Keys**: Fetches keys from `users/{uid}/keys` in Cloud Firestore.
- **Key Details Card**: Displays API Key string (`sk_live_...`), Agent Type, Model, Accuracy Level, Usage Limit, and Copy to Clipboard button.
- **Transaction History**: Displays Razorpay Payment ID, Invoice Date, and Amount.

### 2.2 Passcode-Protected Admin Portal (`admin.html`)
- **Lock Overlay**: Passcode authentication modal (`shoora2026admin`).
- **Key Vault Inventory**: Interface to add pre-allocated API Keys for specific Agent/Model configurations.
- **Customer Ledger**: View all user orders, assigned keys, and payment IDs.
- **Security Controls**: Ability to update Admin passcode.

---

## 3. Supporting Pages
- **Documentation (`curriculum.html`)**: Endpoint references (`/v1/agent/execute`), authentication headers, rate limits table.
- **Use Cases (`use-cases.html`)**: Detailed deployment patterns for Code Architect, Legal AI, Medical AI, and Quant Trader agents.
- **System Status (`status.html`)**: Real-time status indicators for API Gateway, Multi-Agent Clusters, and Vault Security.
- **About Us (`about.html`)**: Company mission, multi-agent research focus, and developer-first vault security.
- **Support & Contact (`support.html`)**: Support form with category dropdown for Vault Key assistance and Custom SLAs.
- **Privacy Policy (`privacy.html`)**: Trust & transparency guidelines, zero-data retention policies for Sovereign Level 5 models.
