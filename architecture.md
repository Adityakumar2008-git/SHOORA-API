# SHOORA AI — System Architecture & Cloud Topology

This document illustrates the end-to-end system architecture, security isolation boundaries, and data flow topologies for the SHOORA AI platform.

---

## 1. System Topology Diagram

```mermaid
graph TD
    User[Customer Browser] -->|HTTPs / TLS 1.3| WebApp[SHOORA Web App]
    
    subgraph Client Layer
        WebApp --> Nav[Dynamic Auth Navbar]
        WebApp --> Calc[Dynamic Price Calculator]
        WebApp --> Reg[Register Wizard Step 3&4]
        WebApp --> Dash[Customer Dashboard]
    end

    subgraph Firebase Cloud Security Layer
        Nav -->|Authenticate| FAuth[Firebase Authentication]
        Dash -->|Authorized Reads| FDB[(Cloud Firestore DB)]
        
        subgraph Firestore Collections
            FDB --> UCol[users/uid/keys]
            FDB --> VCol[inventory_vault]
            FDB --> OCol[orders]
        end
    end

    subgraph Payment Fulfillment Layer
        Reg -->|Checkout Modal| RZP[Razorpay Gateway]
        RZP -->|Payment Success Callback| FFunc[Firebase Cloud Function]
        FFunc -->|Cryptographic Signature Verify| HMAC[HMAC SHA-256 Verifier]
        HMAC -->|Atomic Key Fulfillment| UCol
        HMAC -->|Audit Logging| OCol
    end
```

---

## 2. Security Boundaries & Data Isolation

### Client-Side Boundary
- The browser contains **ZERO secret API keys** or admin master credentials.
- All pricing options and selections are validated server-side during checkout order creation.

### Firebase Auth Boundary
- User identity is represented by a signed JWT (`ID Token`).
- Firestore Security Rules inspect `request.auth.uid` on every database access request.

### Payment & Key Allocation Boundary
- Razorpay Secret Key is stored exclusively inside Firebase Cloud Functions environment variables (`functions.config().razorpay.secret`).
- Cryptographic verification prevents client-side price tampering or spoofed payment responses.
