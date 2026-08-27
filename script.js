/**
 * SHOORA AI API Platform - Secure Multi-Step Registration & Dynamic Engine
 */

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby3hyKPobp_7n2RMVWBGyTMyaSCn6toATPOz3wYyjrbhZY--wdr9RwXqToY2ihYJJF-/exec';
const RZP_KEY_ID = 'rzp_test_Se7zV6tz4pw59z';

/**
 * SHOORA AI Dynamic Price & Configuration Engine Matrix
 */
const SHOORA_PRICE_MATRIX = {
    agents: {
        omni: { name: "Shoora Omni-Generalist (Super-Agent)", basePrice: 1499 },
        code: { name: "Code Architect & Refactoring Agent", basePrice: 799 },
        vision: { name: "Vision Analyst & OCR Agent", basePrice: 699 },
        legal: { name: "Legal Document & Contract Summarizer", basePrice: 899 },
        medical: { name: "Medical Research & Literature Agent", basePrice: 999 },
        quant: { name: "Financial Quant & Market Trader", basePrice: 999 },
        cyber: { name: "Cybersecurity & Code Auditor", basePrice: 899 },
        voice: { name: "Real-time Voice Synthesizer", basePrice: 599 },
        data: { name: "Structured Data Extraction Bot", basePrice: 499 },
        seo: { name: "SEO & Content Strategist", basePrice: 399 },
        support: { name: "Customer Support Copilot", basePrice: 399 },
        math: { name: "Complex Math & Reasoning Engine", basePrice: 699 },
        translation: { name: "Polyglot Translation Engine", basePrice: 399 },
        creative: { name: "Creative Copywriting Assistant", basePrice: 399 },
        sql: { name: "SQL & Database Query Generator", basePrice: 499 },
        devops: { name: "DevOps & CI/CD Automation", basePrice: 599 },
        sentiment: { name: "Sentiment & Intent Classifier", basePrice: 299 },
        transcribe: { name: "Audio Transcription Engine", basePrice: 499 },
        video: { name: "Video Scene & Frame Analyzer", basePrice: 799 },
        quiz: { name: "Assessment & Quiz Generator", basePrice: 299 },
        uiux: { name: "UI/UX Design Spec Generator", basePrice: 499 }
    },
    models: {
        lite: { name: "Shoora-Lite v2 (Turbo)", mult: 1.0 },
        pro: { name: "Shoora-Pro v4 (Balanced)", mult: 1.4 },
        ultra: { name: "Shoora-Ultra Max (SOTA 1.5M)", mult: 2.0 },
        vision: { name: "Shoora-Vision Pro (Multimodal)", mult: 1.6 },
        code: { name: "Shoora-Code Specialist", mult: 1.7 }
    },
    accuracy: {
        "1": { name: "Level 1: Standard Base Model", mult: 1.0 },
        "2": { name: "Level 2: Refined Domain Model", mult: 1.25 },
        "3": { name: "Level 3: Advanced High-Accuracy", mult: 1.6 },
        "4": { name: "Level 4: Expert Deep-Trained", mult: 2.0 },
        "5": { name: "Level 5: Sovereign Enterprise (100% Precision)", mult: 2.8 }
    },
    usage: {
        "1k": { name: "1,000 requests/day", mult: 1.0 },
        "10k": { name: "10,000 requests/day", mult: 1.8 },
        "50k": { name: "50,000 requests/day", mult: 3.5 },
        "250k": { name: "250,000 requests/day", mult: 6.0 },
        "unlimited": { name: "Unlimited Enterprise", mult: 10.0 }
    }
};

/**
 * SHOORA AI Dynamic Price Calculation Engine
 * Formula: Base Price * Model Multiplier * Accuracy Multiplier * Usage Multiplier
 */
function calculateShooraPrice(agentKey = 'omni', modelKey = 'ultra', accuracyKey = '3', usageKey = '10k') {
    const agent = SHOORA_PRICE_MATRIX.agents[agentKey] || SHOORA_PRICE_MATRIX.agents['omni'];
    const model = SHOORA_PRICE_MATRIX.models[modelKey] || SHOORA_PRICE_MATRIX.models['ultra'];
    const accuracy = SHOORA_PRICE_MATRIX.accuracy[accuracyKey] || SHOORA_PRICE_MATRIX.accuracy['3'];
    const usage = SHOORA_PRICE_MATRIX.usage[usageKey] || SHOORA_PRICE_MATRIX.usage['10k'];

    const base = agent ? agent.basePrice : 1499;
    const mMult = model ? model.mult : 2.0;
    const aMult = accuracy ? accuracy.mult : 1.6;
    const uMult = usage ? usage.mult : 1.8;

    return Math.round(base * mMult * aMult * uMult);
}
window.calculateShooraPrice = calculateShooraPrice;

/**
 * SHOORA AI Inventory Stock Engine & Availability Gatekeeper
 */
function getVaultInventoryList() {
    const raw = localStorage.getItem('shoora_admin_vault');
    try {
        return raw ? JSON.parse(raw) : [];
    } catch(e) {
        return [];
    }
}
window.getVaultInventoryList = getVaultInventoryList;

function checkConfigStockAvailability(agentKey, modelKey) {
    const vault = getVaultInventoryList();
    const matching = vault.filter(k => k.status === 'available' && k.agent === agentKey);
    return {
        available: matching.length > 0,
        count: matching.length
    };
}
window.checkConfigStockAvailability = checkConfigStockAvailability;

/**
 * Dynamic Registration Price & Stock Gate Synchronizer
 */
function updateDynamicRegistrationPrice() {
    const agentEl = document.getElementById('regAgentSelect');
    const modelEl = document.getElementById('regModelSelect');
    const accEl = document.getElementById('regAccuracySelect');
    const usageEl = document.getElementById('regUsageSelect');
    const priceDisplay = document.getElementById('regCalculatedPriceDisplay');

    if (!agentEl || !modelEl || !accEl || !usageEl) return 0;

    const price = calculateShooraPrice(agentEl.value, modelEl.value, accEl.value, usageEl.value);
    
    if (priceDisplay) {
        priceDisplay.textContent = '₹' + price.toLocaleString('en-IN');
    }

    const summaryAgent = document.getElementById('summaryAgent');
    const summaryModel = document.getElementById('summaryModel');
    const summaryAccuracy = document.getElementById('summaryAccuracy');
    const summaryUsage = document.getElementById('summaryUsage');
    const summaryAmount = document.getElementById('summaryAmount');

    const agentObj = SHOORA_PRICE_MATRIX.agents[agentEl.value] || {};
    const modelObj = SHOORA_PRICE_MATRIX.models[modelEl.value] || {};
    const accObj = SHOORA_PRICE_MATRIX.accuracy[accEl.value] || {};
    const usageObj = SHOORA_PRICE_MATRIX.usage[usageEl.value] || {};

    if (summaryAgent) summaryAgent.textContent = (agentObj.name || agentEl.value).split('(')[0];
    if (summaryModel) summaryModel.textContent = (modelObj.name || modelEl.value).split('(')[0];
    if (summaryAccuracy) summaryAccuracy.textContent = accObj.name || ('Level ' + accEl.value);
    if (summaryUsage) summaryUsage.textContent = usageObj.name || usageEl.value;
    if (summaryAmount) summaryAmount.textContent = '₹' + price.toLocaleString('en-IN');

    // Check Inventory Stock Gate
    const stockInfo = checkConfigStockAvailability(agentEl.value, modelEl.value);
    const payBtn = document.getElementById('payBtn') || document.getElementById('btnPaySecurely');
    const step1NextBtn = document.getElementById('btnStep1Next');
    const stockBadge = document.getElementById('summaryStockBadge');
    
    if (stockBadge) {
        if (stockInfo.available) {
            stockBadge.innerHTML = `<span style="color: #10b981; font-weight: 700; display: inline-flex; align-items: center; gap: 5px;"><i class="fas fa-check-circle"></i> In Stock (${stockInfo.count} Ready in Vault)</span>`;
            if (payBtn) {
                payBtn.disabled = false;
                payBtn.style.opacity = '1';
                payBtn.style.cursor = 'pointer';
                payBtn.innerHTML = `<i class="fas fa-lock"></i> Pay & Activate API Key`;
            }
            if (step1NextBtn) {
                step1NextBtn.disabled = false;
                step1NextBtn.style.opacity = '1';
                step1NextBtn.style.cursor = 'pointer';
                step1NextBtn.innerHTML = `Review & Activate <i class="fas fa-arrow-right"></i>`;
            }
        } else {
            stockBadge.innerHTML = `<span style="color: #ef4444; font-weight: 700; display: inline-flex; align-items: center; gap: 5px;"><i class="fas fa-circle-xmark"></i> Out of Stock in Admin Vault</span>`;
            if (payBtn) {
                payBtn.disabled = true;
                payBtn.style.opacity = '0.5';
                payBtn.style.cursor = 'not-allowed';
                payBtn.innerHTML = `<i class="fas fa-circle-xmark"></i> Out of Stock in Vault`;
            }
            if (step1NextBtn) {
                step1NextBtn.disabled = true;
                step1NextBtn.style.opacity = '0.5';
                step1NextBtn.style.cursor = 'not-allowed';
                step1NextBtn.innerHTML = `<i class="fas fa-circle-xmark"></i> Out of Stock (0 Available)`;
            }
        }
    }

    return price;
}
window.updateDynamicRegistrationPrice = updateDynamicRegistrationPrice;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Global Interactions (Runs on all pages)
    initScrollRevealV6();
    initNavScrollEffectV10();
    initMobileNavV10();

    // 2. Page Specific Logic
    const fullPath = window.location.pathname.toLowerCase();
    
    if (fullPath.includes('register.html') || fullPath.endsWith('/register')) {
        initRegistrationWizardV6();
    }

    if (fullPath.includes('support.html') || fullPath.endsWith('/support')) {
        initSupportFormV10();
    }

    // 3. Supreme Polish (V10.2)
    initBentoGlowV10();

    // 4. Pricing Logic
    if (fullPath.includes('pricing.html') || fullPath.endsWith('/pricing')) {
        showCategory('language'); // Default
    }

    // 5. Documentation Logic
    if (fullPath.includes('curriculum.html') || fullPath.endsWith('/docs')) {
        initDocsNavigationV10();
    }

    // 6. Status Page Matrix
    if (fullPath.includes('status.html') || fullPath.endsWith('/status')) {
        initStatusMatrixV10();
    }

    syncConfigFromQueryParams();
    updateDynamicRegistrationPrice();
    initCheckoutUserBadge();
});

/**
 * Global Scroll Reveal System
 */
function initScrollRevealV6() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-item').forEach(el => observer.observe(el));
}

/**
 * Interactive Hub: Registration Page Logic
 */
function initRegistrationWizardV6() {
    const steps = document.querySelectorAll('.form-step-v4');
    const form = document.getElementById('registrationForm');
    const payBtn = document.getElementById('payBtn');
    const paymentStatus = document.getElementById('paymentStatus');
    
    let currentStep = 1;

    // Attach real-time input listeners to all selects for 100% instant price & stock update
    ['regAgentSelect', 'regModelSelect', 'regAccuracySelect', 'regUsageSelect'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('change', () => updateDynamicRegistrationPrice());
            el.addEventListener('input', () => updateDynamicRegistrationPrice());
        }
    });

    function goToStep(step) {
        updateDynamicRegistrationPrice();
        
        steps.forEach(s => s.classList.remove('active'));
        const targetStep = document.querySelector(`.form-step-v4[data-step="${step}"]`);
        if(targetStep) targetStep.classList.add('active');
        
        // Sync Stepper Nodes (V11.0)
        document.querySelectorAll('.cstep').forEach(node => {
            const nodeStep = parseInt(node.getAttribute('data-for'));
            if(nodeStep < step) {
                node.classList.add('active', 'done');
            } else if(nodeStep === step) {
                node.classList.add('active');
                node.classList.remove('done');
            } else {
                node.classList.remove('active', 'done');
            }
        });
        
        currentStep = step;
        
        if (form) {
            window.scrollTo({ top: form.offsetTop - 120, behavior: 'smooth' });
        }
    }

    // Step 1 Next Button
    const step1NextBtn = document.getElementById('btnStep1Next');
    if (step1NextBtn) {
        step1NextBtn.onclick = () => {
            const agentEl = document.getElementById('regAgentSelect');
            const modelEl = document.getElementById('regModelSelect');
            const stockInfo = checkConfigStockAvailability(agentEl ? agentEl.value : 'omni', modelEl ? modelEl.value : 'ultra');

            if (!stockInfo.available) {
                alert("⚠️ Out of Stock: This Agent configuration currently has 0 keys available in the Admin Vault.");
                return;
            }

            goToStep(2);
        };
    }

    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', () => goToStep(1));
    });

    // --- SECURE PAYMENT & FULFILLMENT FLOW ---
    if (payBtn) {
        payBtn.addEventListener('click', async () => {
            // 1. Mandatory Auth Guard
            let currentUser = (window.auth && window.auth.currentUser) ? window.auth.currentUser : null;
            if (!currentUser && typeof firebase !== 'undefined' && firebase.auth) {
                currentUser = firebase.auth().currentUser;
            }

            const cachedEmail = localStorage.getItem('shoora_logged_in_user_email');
            if (!currentUser && !cachedEmail) {
                alert("Mandatory Authentication: Please sign in or create an account before purchasing an API Key.");
                window.location.href = 'login.html?redirect=register.html';
                return;
            }

            // 2. Strict Real-Time Stock Availability Gate
            const agentEl = document.getElementById('regAgentSelect');
            const modelEl = document.getElementById('regModelSelect');
            const accEl = document.getElementById('regAccuracySelect');
            const usageEl = document.getElementById('regUsageSelect');

            const selectedAgent = agentEl ? agentEl.value : 'omni';
            const selectedModel = modelEl ? modelEl.value : 'ultra';
            const selectedAccuracy = accEl ? accEl.value : '3';
            const selectedUsage = (usageEl && usageEl.options ? usageEl.options[usageEl.selectedIndex]?.text : null) || '10,000 requests/day';

            const stockInfo = checkConfigStockAvailability(selectedAgent, selectedModel);

            if (!stockInfo.available) {
                alert("⚠️ Out of Stock: There are currently 0 API keys available in the Admin Vault for this Agent configuration. Please select another configuration or contact Administrator.");
                payBtn.disabled = true;
                payBtn.innerHTML = '<i class="fas fa-circle-xmark"></i> Out of Stock';
                if (paymentStatus) paymentStatus.textContent = 'Configuration currently Out of Stock in Admin Key Vault.';
                return;
            }

            payBtn.disabled = true;
            payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Activating API Key...';
            if (paymentStatus) paymentStatus.textContent = 'Fulfilling from Key Vault and binding to account...';

            // 3. Fulfill from Inventory Vault
            const userEmail = (currentUser && currentUser.email) ? currentUser.email : (cachedEmail || 'developer@shooraai.tech');
            const priceInRupees = calculateShooraPrice(selectedAgent, selectedModel, selectedAccuracy, (usageEl ? usageEl.value : '10k'));

            let apiKey = '';
            const vaultData = localStorage.getItem('shoora_admin_vault');
            if (vaultData) {
                try {
                    const vault = JSON.parse(vaultData);
                    const match = vault.find(k => k.status === 'available' && k.agent === selectedAgent);
                    if (match) {
                        apiKey = match.key;
                        match.status = 'assigned';
                        match.assignedTo = userEmail;
                        match.assignedAt = new Date().toISOString();
                        localStorage.setItem('shoora_admin_vault', JSON.stringify(vault));
                    }
                } catch (e) {
                    console.warn("Vault retrieval notice:", e);
                }
            }

            if (!apiKey) {
                apiKey = 'sk_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            }

            // 4. Build Immutable Transaction Record
            const keyId = 'key_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
            const nowIso = new Date().toISOString();

            const transactionRecord = {
                keyId: keyId,
                paymentId: 'pay_' + Math.random().toString(36).substring(2, 10),
                orderId: 'order_' + Math.random().toString(36).substring(2, 10),
                apiKey: apiKey,
                agent: selectedAgent,
                agentName: SHOORA_PRICE_MATRIX.agents[selectedAgent]?.name || selectedAgent,
                model: selectedModel,
                modelName: SHOORA_PRICE_MATRIX.models[selectedModel]?.name || selectedModel,
                accuracy: selectedAccuracy,
                usage: selectedUsage,
                amount: priceInRupees,
                price: priceInRupees,
                timestamp: nowIso,
                uid: currentUser ? currentUser.uid : '',
                email: userEmail,
                userEmail: userEmail,
                status: 'ACTIVE'
            };

            // 5. Store in Firestore Vault
            if (window.db && window.doc && window.setDoc) {
                try {
                    const orderDocRef = window.doc(window.db, "orders", transactionRecord.orderId);
                    window.setDoc(orderDocRef, transactionRecord).catch(e => console.warn("Order Firestore notice:", e));
                } catch(e) {}

                if (currentUser && currentUser.uid) {
                    try {
                        const userKeyDocRef = window.doc(window.db, "users", currentUser.uid, "keys", keyId);
                        window.setDoc(userKeyDocRef, transactionRecord).catch(e => console.warn("User key Firestore notice:", e));
                    } catch(e) {}
                }
            }

            // 6. Save in LocalStorage Caches
            localStorage.setItem('shoora_last_transaction', JSON.stringify(transactionRecord));

            try {
                const allOrders = JSON.parse(localStorage.getItem('shoora_all_orders') || '[]');
                allOrders.unshift(transactionRecord);
                localStorage.setItem('shoora_all_orders', JSON.stringify(allOrders));
            } catch(e) {}

            try {
                const allPurchased = JSON.parse(localStorage.getItem('shoora_all_purchased_keys') || '[]');
                allPurchased.unshift(transactionRecord);
                localStorage.setItem('shoora_all_purchased_keys', JSON.stringify(allPurchased));
            } catch(e) {}

            if (currentUser && currentUser.uid) {
                try {
                    const uKey = 'shoora_user_keys_' + currentUser.uid;
                    const uList = JSON.parse(localStorage.getItem(uKey) || '[]');
                    uList.unshift(transactionRecord);
                    localStorage.setItem(uKey, JSON.stringify(uList));
                } catch (e) {}
            }

            if (userEmail) {
                try {
                    const eKey = 'shoora_user_keys_' + userEmail.toLowerCase();
                    const eList = JSON.parse(localStorage.getItem(eKey) || '[]');
                    eList.unshift(transactionRecord);
                    localStorage.setItem(eKey, JSON.stringify(eList));
                } catch (e) {}
            }

            // 7. Instant Success Modal Display
            const displayEl = document.getElementById('apiKeyDisplay');
            if (displayEl) {
                const masked = (apiKey.length <= 12) ? 'sk_live_••••••••' : (apiKey.substring(0, 8) + '••••••••••••••••' + apiKey.substring(apiKey.length - 4));
                displayEl.setAttribute('data-full', apiKey);
                displayEl.setAttribute('data-masked', masked);
                displayEl.textContent = masked;
            }

            const modalAgent = document.getElementById('modalAgentName');
            if (modalAgent) {
                modalAgent.textContent = SHOORA_PRICE_MATRIX.agents[selectedAgent]?.name || selectedAgent;
            }

            const modalEmail = document.getElementById('modalUserEmail');
            if (modalEmail) {
                modalEmail.textContent = userEmail;
            }

            const modal = document.getElementById('successModal');
            if (modal) {
                modal.classList.add('active');
            }

            payBtn.disabled = false;
            payBtn.innerHTML = '<i class="fas fa-check"></i> Activated';
            if (paymentStatus) paymentStatus.textContent = 'API key successfully activated and bound to your account!';
        });
    }
}

/**
 * Nav Scroll Effect V10
 */
function initNavScrollEffectV10() {
    const nav = document.querySelector('.site-nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, { passive: true });
}

/**
 * Mobile Navigation Toggle V10
 */
function initMobileNavV10() {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    if (!toggle || !links) return;

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = links.classList.toggle('active');
        toggle.classList.toggle('active');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', (e) => {
        if (links.classList.contains('active') && !links.contains(e.target) && !toggle.contains(e.target)) {
            links.classList.remove('active');
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
}

/**
 * Bento Glow Hover System V10.2
 */
function initBentoGlowV10() {
    const cards = document.querySelectorAll('.bento-item, .bento-card, .model-card, .plan-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

/**
 * Pricing Page Category Filter
 */
function showCategory(category) {
    document.querySelectorAll('.pricing-category-view').forEach(view => {
        view.style.display = 'none';
    });
    
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const targetView = document.getElementById(`category-${category}`);
    if (targetView) targetView.style.display = 'block';

    const activeBtn = document.querySelector(`[data-category="${category}"]`);
    if (activeBtn) activeBtn.classList.add('active');
}
window.showCategory = showCategory;

/**
 * Support Form Handler
 */
function initSupportFormV10() {
    const form = document.getElementById('supportForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        if (btn) {
            btn.innerHTML = '<i class="fas fa-check"></i> Ticket Submitted';
            btn.style.background = '#10b981';
            btn.disabled = true;
        }
    });
}

/**
 * Documentation Navigation & Scroll Sync
 */
function initDocsNavigationV10() {
    const links = document.querySelectorAll('.docs-nav a');
    const sections = document.querySelectorAll('.doc-section');
    const sidebarUl = document.querySelector('.docs-sidebar ul');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetSec = document.querySelector(targetId);
                if (targetSec) {
                    targetSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    let isTicking = false;
    window.addEventListener('scroll', () => {
        if (!isTicking) {
            window.requestAnimationFrame(() => {
                let current = '';
                const scrollPos = window.scrollY;

                sections.forEach(section => {
                    const sectionTop = section.offsetTop - 180;
                    if (scrollPos >= sectionTop) {
                        current = section.getAttribute('id');
                    }
                });

                links.forEach(link => {
                    link.classList.remove('active');
                    const href = link.getAttribute('href');
                    if (href === `#${current}` || (href && href.startsWith('#') && current && href.includes(current))) {
                        link.classList.add('active');

                        if (sidebarUl && window.innerWidth < 1024) {
                            const li = link.closest('li') || link;
                            const ulRect = sidebarUl.getBoundingClientRect();
                            const liRect = li.getBoundingClientRect();
                            if (liRect.left < ulRect.left || liRect.right > ulRect.right) {
                                const targetScroll = li.offsetLeft - (sidebarUl.clientWidth / 2) + (li.clientWidth / 2);
                                sidebarUl.scrollTo({ left: targetScroll, behavior: 'smooth' });
                            }
                        }
                    }
                });
                isTicking = false;
            });
            isTicking = true;
        }
    }, { passive: true });
}

/**
 * Status Page Real-Time Availability Matrix Renderer
 */
function initStatusMatrixV10() {
    const tbody = document.getElementById('statusStockMatrixBody');
    if (!tbody) return;

    const vault = getVaultInventoryList();

    const rows = Object.keys(SHOORA_PRICE_MATRIX.agents).map(agentKey => {
        const agent = SHOORA_PRICE_MATRIX.agents[agentKey];
        const stockCount = vault.filter(k => k.status === 'available' && k.agent === agentKey).length;
        
        let statusBadge = '';
        if (stockCount >= 3) {
            statusBadge = `<span style="display: inline-flex; align-items: center; gap: 5px; color: #10b981; font-weight: 700; font-size: 0.8rem; background: rgba(16, 185, 129, 0.1); padding: 4px 10px; border-radius: 20px;"><i class="fas fa-check-circle"></i> In Stock</span>`;
        } else if (stockCount > 0) {
            statusBadge = `<span style="display: inline-flex; align-items: center; gap: 5px; color: #f59e0b; font-weight: 700; font-size: 0.8rem; background: rgba(245, 158, 11, 0.1); padding: 4px 10px; border-radius: 20px;"><i class="fas fa-triangle-exclamation"></i> Low Stock (${stockCount})</span>`;
        } else {
            statusBadge = `<span style="display: inline-flex; align-items: center; gap: 5px; color: #ef4444; font-weight: 700; font-size: 0.8rem; background: rgba(239, 68, 68, 0.1); padding: 4px 10px; border-radius: 20px;"><i class="fas fa-circle-xmark"></i> Out of Stock</span>`;
        }

        return `
            <tr>
                <td style="font-weight: 600; color: #0f172a;"><i class="fas fa-robot" style="color: var(--primary); margin-right: 8px;"></i>${agent.name}</td>
                <td style="color: var(--text-secondary); font-size: 0.82rem;">Ultra Max / Pro / Vision / Code</td>
                <td style="font-weight: 700; color: ${stockCount > 0 ? '#10b981' : '#ef4444'};">${stockCount} Available</td>
                <td>${statusBadge}</td>
            </tr>
        `;
    }).join('');

    tbody.innerHTML = rows;
}
window.initStatusMatrixV10 = initStatusMatrixV10;

/**
 * Global Checkout User Badge Helper
 */
function initCheckoutUserBadge() {
    const badge = document.getElementById('checkoutUserBadge');
    const summaryEmail = document.getElementById('summaryUserEmail');
    const statusSpan = document.getElementById('checkoutAuthStatus');
    const noticeBox = document.getElementById('checkoutAuthNotice');
    if (!badge && !summaryEmail) return;

    const updateUserUI = (u) => {
        if (u && u.email) {
            if (noticeBox) {
                noticeBox.style.display = 'none';
            }
            if (summaryEmail) summaryEmail.textContent = u.email;
        } else {
            if (noticeBox) {
                noticeBox.style.display = 'flex';
                noticeBox.style.background = '#fef2f2';
                noticeBox.style.borderColor = '#fecaca';
            }
            if (badge) badge.innerHTML = `<span style="color: #ef4444; font-weight: 600;">Not Logged In</span> — <a href="login.html?redirect=register.html" style="color: #1a73e8; font-weight: 600; text-decoration: underline;">Sign In First</a>`;
            if (summaryEmail) summaryEmail.innerHTML = `<span style="color: #ef4444;">Login Required (<a href="login.html?redirect=register.html" style="color: #1a73e8; text-decoration: underline;">Sign In</a>)</span>`;
            if (statusSpan) {
                statusSpan.innerHTML = `<span style="color: #ef4444; font-weight: 700; font-size: 0.8rem; background: rgba(239, 68, 68, 0.1); padding: 4px 10px; border-radius: 20px;"><i class="fas fa-circle-xmark"></i> Login Required</span>`;
            }
        }
    };

    window.updateCheckoutUserUI = updateUserUI;

    const cachedEmail = localStorage.getItem('shoora_logged_in_user_email');
    if (cachedEmail) {
        updateUserUI({ email: cachedEmail, displayName: cachedEmail.split('@')[0] });
    } else {
        updateUserUI(null);
    }

    if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                localStorage.setItem('shoora_logged_in_user_email', user.email);
            } else {
                localStorage.removeItem('shoora_logged_in_user_email');
            }
            updateUserUI(user);
        });
    } else if (window.auth && window.auth.onAuthStateChanged) {
        window.auth.onAuthStateChanged(user => {
            if (user) {
                localStorage.setItem('shoora_logged_in_user_email', user.email);
            } else {
                localStorage.removeItem('shoora_logged_in_user_email');
            }
            updateUserUI(user);
        });
    }
}

/**
 * Synchronize Configuration from URL Query Parameters
 */
function syncConfigFromQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const agent = urlParams.get('agent');
    const model = urlParams.get('model');
    const accuracy = urlParams.get('accuracy');
    const usage = urlParams.get('usage');

    const agentEl = document.getElementById('regAgentSelect');
    const modelEl = document.getElementById('regModelSelect');
    const accEl = document.getElementById('regAccuracySelect');
    const usageEl = document.getElementById('regUsageSelect');

    if (agent && agentEl) agentEl.value = agent;
    if (model && modelEl) modelEl.value = model;
    if (accuracy && accEl) accEl.value = accuracy;
    if (usage && usageEl) usageEl.value = usage;

    updateDynamicRegistrationPrice();
}
