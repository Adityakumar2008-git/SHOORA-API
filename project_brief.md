# SHOORA AI — Executive Project Brief & Platform Vision

## 1. Executive Summary
**SHOORA AI** is an industry-grade, multi-agent AI API platform designed to democratize high-scale AI capabilities for developers, startups, and enterprises. Moving beyond fixed monthly subscription traps, SHOORA AI introduces a **Dynamic Multi-Factor Pricing Matrix** and **Mandatory User Account Key Ownership Vaults**.

Every customer receives a dedicated user account, transparent real-time cost calculation based on their specific workload requirements, and guaranteed key ownership in their personal account dashboard.

---

## 2. Platform Core Objectives
1. **Developer Trust & Ownership**: Eliminate anonymous purchases by enforcing mandatory account creation before checkout. Every purchased API Key is cryptographically bound to the user's `users/{uid}/keys` Firestore vault.
2. **Multi-Agent Capabilities**: Provide access to 20+ specialized AI Agents (Code Architect, Legal Summarizer, Medical AI, Financial Quant, Cybersecurity Auditor, Real-Time Voice Synthesizer, etc.) and 1 Omni-Generalist Super Agent.
3. **Dynamic Pricing Engine**: Calculate exact key costs dynamically using 4 configurable factors: Agent Task, Foundation Model (Lite v2, Pro v4, Ultra Max 1.5M, Vision Pro, Code Specialist), Accuracy/Fine-Tuning Level (Level 1 to Level 5), and Daily Request Capacity (1k to Unlimited).
4. **Enterprise Security & Administration**: Provide an isolated, passcode-protected Admin Vault Portal (`admin.html`) for managing API Key inventory pools, viewing real-time transaction ledgers, and controlling system parameters.

---

## 3. Target Audience & Market Segments
- **Individual Software Developers**: Rapidly integrating specialized AI agents into web & mobile applications.
- **Growing Startups & Engineering Teams**: Requiring high-accuracy domain models with guaranteed SLAs and sub-40ms latency.
- **Enterprise Engineering Orgs**: Seeking Level 5 Sovereign models with zero-data retention policies, private VPC capabilities, and dedicated key pools.

---

## 4. Key Platform Features
- **Dynamic API Cost Calculator**: Real-time interactive widget on `pricing.html` and wizard step on `register.html`.
- **Firebase Authentication & Account System**: 1-click Google Sign-In and Email/Password authentication.
- **Customer Key Dashboard (`dashboard.html`)**: Complete self-service portal to view, copy, manage, and audit owned API Keys and purchase receipts.
- **Passcode-Protected Admin Portal (`admin.html`)**: Vault inventory management for pre-loaded keys and revenue tracking.
- **Server-Side Razorpay HMAC Verification**: Server-side cryptographic signature validation preventing payment tampering.
