# SHOORA AI — Complete Visual & Logical Sitemap

This document defines the complete site hierarchy, route permissions, navigation flows, and page relationships across the SHOORA AI platform.

---

## 1. Visual Navigation Tree

```
SHOORA AI Platform Root (/)
│
├── 🌐 Public Marketing & Documentation Routes
│   ├── index.html                  (Home / Landing Page)
│   ├── pricing.html                (Dynamic Calculator & Price Matrix)
│   ├── use-cases.html              (Specialized Agent Solutions)
│   ├── curriculum.html             (API Documentation & Endpoints)
│   ├── status.html                 (System Status & Cluster Health)
│   ├── about.html                  (Mission & Multi-Agent Infrastructure)
│   ├── support.html                (24/7 Technical Support)
│   └── privacy.html                (Privacy & Trust Architecture)
│
├── 🔑 Customer Authentication & Ownership Routes
│   ├── login.html                  (Sign In / Sign Up Portal)
│   ├── register.html               (API Configuration & Checkout Wizard)
│   └── dashboard.html              (Protected Customer Key Inventory) [Requires Auth]
│
└── 🔒 Administrative Control Routes
    └── admin.html                  (Passcode-Protected Admin Control Center) [Requires Admin Lock]
```

---

## 2. Route Permissions & Access Control Matrix

| Route | Access Level | Auth Guard | Purpose |
| :--- | :--- | :--- | :--- |
| `index.html` | Public | None | Product introduction & features |
| `pricing.html` | Public | None | Interactive Dynamic API Cost Calculator |
| `curriculum.html` | Public | None | Technical documentation & API schemas |
| `use-cases.html` | Public | None | Agent use case demonstrations |
| `status.html` | Public | None | Real-time system health |
| `about.html` | Public | None | Company background & infrastructure |
| `support.html` | Public | None | Contact & support submission |
| `privacy.html` | Public | None | Privacy policy & data ethics |
| `login.html` | Public | Redirects if Authed | User login & account creation |
| `register.html` | Public View | Auth Required on Pay | API configuration & Razorpay checkout |
| `dashboard.html` | Protected | Firebase Auth (`uid`) | Self-service key management & receipts |
| `admin.html` | Admin Only | Passcode Modal Lock | Admin inventory vault & transaction ledger |

---

## 3. Navigation Header State Rules

### Unauthenticated State (Logged Out):
- Brand Logo -> `index.html`
- Use Cases -> `use-cases.html`
- Pricing -> `pricing.html`
- Documentation -> `curriculum.html`
- Status -> `status.html`
- About -> `about.html`
- Support -> `support.html`
- **CTA Button**: `Login / Sign Up` -> `login.html`

### Authenticated State (Logged In):
- Brand Logo -> `index.html`
- Use Cases -> `use-cases.html`
- Pricing -> `pricing.html`
- Documentation -> `curriculum.html`
- Status -> `status.html`
- About -> `about.html`
- Support -> `support.html`
- **CTA Button**: `Dashboard` -> `dashboard.html`
- **User Menu**: Profile Email & Sign Out Action
