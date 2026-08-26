# SHOORA AI — End-to-End Operational Workflows

This document defines step-by-step user journeys, payment fulfillment workflows, and admin operations.

---

## Workflow 1: Customer Account Sign-Up & Authentication
1. User visits SHOORA AI website (e.g. `index.html` or `pricing.html`).
2. User clicks **Login / Sign Up** in the top navigation bar.
3. User is directed to `login.html` and chooses either **Google 1-Click Sign-In** or **Email & Password Sign-Up**.
4. Firebase Auth validates credentials, creates user record, and issues signed JWT ID Token.
5. Navbar automatically updates on all pages to display **Dashboard** button and user profile icon.

---

## Workflow 2: Dynamic API Configuration & Checkout
1. Authenticated user navigates to `pricing.html` or `register.html`.
2. User selects desired parameters:
   - **AI Agent Task**: e.g., Shoora Omni Super-Agent or Code Architect.
   - **Foundation Model**: e.g., Shoora-Ultra Max 1.5M Context.
   - **Accuracy Precision**: e.g., Level 3 High-Accuracy.
   - **Daily Request Capacity**: e.g., 10,000 req/day.
3. Dynamic Price Engine calculates total price (e.g. `₹6,907`).
4. User clicks **Review & Checkout**.
5. System verifies active authentication session. If logged out, redirects to `login.html?redirect=register.html`.

---

## Workflow 3: Razorpay Payment & Server Key Fulfillment
1. Razorpay Payment Modal opens with prefilled user email and calculated amount in paisa (`690700`).
2. User completes payment via UPI, Credit Card, or Net Banking.
3. Razorpay returns `razorpay_payment_id`, `razorpay_order_id`, and `razorpay_signature`.
4. Client sends payment data to server Cloud Function `/verifyAndFulfillPayment`.
5. Cloud Function verifies HMAC SHA-256 signature using Razorpay Secret.
6. Function checks `inventory_vault` in Firestore for an available key matching the configured Agent/Model.
7. Function atomically binds the API Key to `users/{uid}/keys/{keyId}` in Firestore and logs order in `orders/{orderId}`.
8. Client displays success modal with generated key and redirects user to `dashboard.html`.

---

## Workflow 4: Self-Service Key Management (`dashboard.html`)
1. User visits `dashboard.html`.
2. Dashboard queries `users/{request.auth.uid}/keys` from Firestore.
3. User views owned API Keys, active status, agent configurations, and daily quota metrics.
4. User clicks **Copy Key** to copy `sk_live_...` to clipboard for application integration.
5. User views purchase invoices and transaction receipts.

---

## Workflow 5: Admin Inventory Vault Management (`admin.html`)
1. Admin opens `admin.html` and enters passcode (`shoora2026admin`).
2. Admin opens **Key Vault Inventory** tab.
3. Admin selects target Agent Type, Model, and Accuracy Level, enters real backend API Key string, and submits.
4. Key is saved to `inventory_vault` in Firestore with status `AVAILABLE`.
5. When a customer purchases that configuration, status atomically changes to `ASSIGNED`.
