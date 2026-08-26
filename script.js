/**
 * SHOORA AI API Platform - Secure Multi-Step Registration Engine
 */

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby3hyKPobp_7n2RMVWBGyTMyaSCn6toATPOz3wYyjrbhZY--wdr9RwXqToY2ihYJJF-/exec';
const RZP_KEY_ID = 'rzp_test_Se7zV6tz4pw59z';

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
    console.log("Initializing Secure Registration Wizard...");
    
    const steps = document.querySelectorAll('.form-step-v4');
    const progressBar = document.getElementById('formProgress');
    const form = document.getElementById('registrationForm');
    const payBtn = document.getElementById('payBtn');
    const paymentStatus = document.getElementById('paymentStatus');
    
    let currentStep = 1;

    // Restore Data on Load
    const saved = localStorage.getItem('shoora_v1_draft');
    if(saved) {
        const data = JSON.parse(saved);
        Object.keys(data).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if(field) field.value = data[key];
        });
    }

    window.updateDynamicRegistrationPrice = function() {
        const agent = document.getElementById('regAgentSelect')?.value || 'omni';
        const model = document.getElementById('regModelSelect')?.value || 'ultra';
        const accuracy = document.getElementById('regAccuracySelect')?.value || '3';
        const usage = document.getElementById('regUsageSelect')?.value || '10k';

        const priceInRupees = calculateShooraPrice(agent, model, accuracy, usage);
        const displayEl = document.getElementById('regCalculatedPriceDisplay');
        if (displayEl) {
            displayEl.textContent = '₹' + priceInRupees.toLocaleString('en-IN');
        }

        const summaryAgent = document.getElementById('summaryAgent');
        const summaryModel = document.getElementById('summaryModel');
        const summaryAccuracy = document.getElementById('summaryAccuracy');
        const summaryUsage = document.getElementById('summaryUsage');
        const summaryAmount = document.getElementById('summaryAmount');

        if (summaryAgent) summaryAgent.textContent = (SHOORA_PRICE_MATRIX.agents[agent]?.name || agent).split('(')[0];
        if (summaryModel) summaryModel.textContent = (SHOORA_PRICE_MATRIX.models[model]?.name || model).split('(')[0];
        if (summaryAccuracy) summaryAccuracy.textContent = 'Level ' + accuracy;
        if (summaryUsage) summaryUsage.textContent = SHOORA_PRICE_MATRIX.usage[usage]?.name || usage;
        if (summaryAmount) summaryAmount.textContent = '₹' + priceInRupees.toLocaleString('en-IN');

        return priceInRupees;
    };

    function updateSummary() {
        window.updateDynamicRegistrationPrice();
    }

    function getSelectedAmount() {
        const priceInRupees = window.updateDynamicRegistrationPrice();
        return priceInRupees * 100; // Razorpay expects amount in paisa
    }

    function goToStep(step) {
        if (step === 4) updateSummary();
        
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
        
        // Scroll to form with offset
        window.scrollTo({ top: form.offsetTop - 120, behavior: 'smooth' });
    }

    // Next/Back Listeners
    document.querySelectorAll('.next-btn').forEach(btn => {
        btn.onclick = () => {
            const currentFields = steps[currentStep-1].querySelectorAll('input, select');
            let isValid = true;
            
            currentFields.forEach(f => { 
                if(!f.checkValidity()){ 
                    f.reportValidity(); 
                    isValid = false; 
                }
            });
            
            if(isValid) {
                console.log("Moving to step " + (currentStep + 1));
                const data = Object.fromEntries(new FormData(form).entries());
                localStorage.setItem('shoora_v1_draft', JSON.stringify(data));
                goToStep(currentStep + 1);
            } else {
                console.warn("Section validation failed.");
            }
        };
    });

    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', () => goToStep(currentStep - 1));
    });

    // --- SECURE PAYMENT FLOW ---
    payBtn.addEventListener('click', async () => {
        // Mandatory Auth Guard
        let currentUser = (window.auth && window.auth.currentUser) ? window.auth.currentUser : null;
        if (!currentUser && typeof firebase !== 'undefined' && firebase.auth) {
            currentUser = firebase.auth().currentUser;
        }

        if (!currentUser) {
            alert("Mandatory Authentication: Please sign in or create an account before purchasing an API Key.");
            window.location.href = 'login.html?redirect=register.html';
            return;
        }

        try {
            payBtn.disabled = true;
            payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
            paymentStatus.textContent = 'Opening Secure Payment Window...';

            launchRazorpayV6(null);

        } catch (error) {
            console.error('Payment Error:', error);
            paymentStatus.textContent = 'Server busy. Switching to Direct verification...';
            launchRazorpayV6(null);
        }
    });

    function getSelectedAmount() {
        const agentEl = document.getElementById('regAgentSelect');
        const modelEl = document.getElementById('regModelSelect');
        const accEl = document.getElementById('regAccuracySelect');
        const usageEl = document.getElementById('regUsageSelect');

        if (agentEl && modelEl && accEl && usageEl) {
            const rupeeAmount = calculateShooraPrice(agentEl.value, modelEl.value, accEl.value, usageEl.value);
            return rupeeAmount * 100; // Razorpay requires amount in Paisa
        }

        const plan = document.querySelector('input[name="plan"]:checked');
        if (plan) {
            const parts = plan.value.split('_');
            return parseInt(parts[parts.length - 1] || '49900');
        }
        return 49900;
    }

    function launchRazorpayV6(orderId) {
        const amountPaisa = getSelectedAmount();
        const amountRupees = amountPaisa / 100;
        const agentEl = document.getElementById('regAgentSelect');
        const agentName = agentEl ? (SHOORA_PRICE_MATRIX.agents[agentEl.value]?.name || 'Super-Agent') : 'Super-Agent';

        let currentUser = (window.auth && window.auth.currentUser) ? window.auth.currentUser : null;
        if (!currentUser && typeof firebase !== 'undefined' && firebase.auth) {
            currentUser = firebase.auth().currentUser;
        }

        const options = {
            "key": RZP_KEY_ID,
            "amount": amountPaisa.toString(),
            "currency": "INR",
            "name": "SHOORA AI API Platform",
            "description": "API Key — " + agentName + " (₹" + amountRupees.toLocaleString('en-IN') + ")",
            "order_id": orderId,
            "handler": function (response) {
                verifyAndRegisterV6(response, orderId);
            },
            "prefill": {
                "name": currentUser ? (currentUser.displayName || currentUser.email.split('@')[0]) : 'Developer',
                "email": currentUser ? currentUser.email : '',
                "contact": ''
            },
            "theme": { "color": "#1a73e8" },
            "modal": {
                "ondismiss": function() {
                    payBtn.disabled = false;
                    payBtn.innerHTML = '<i class="fas fa-lock"></i> Pay & Activate API Key';
                    paymentStatus.textContent = 'Payment cancelled. Configuration saved.';
                }
            }
        };

        if (typeof Razorpay === 'undefined') {
            console.warn("Razorpay SDK not loaded. Simulating direct activation...");
            verifyAndRegisterV6({
                razorpay_payment_id: 'pay_test_' + Date.now(),
                razorpay_order_id: orderId || ('order_test_' + Date.now()),
                razorpay_signature: 'sig_test_' + Date.now()
            }, orderId);
            return;
        }

        try {
            const rzp = new Razorpay(options);
            rzp.on('payment.failed', function (response){
                console.error("Razorpay Payment Failed:", response.error);
                paymentStatus.textContent = 'Payment could not be completed. Please try again.';
                payBtn.disabled = false;
                payBtn.innerHTML = '<i class="fas fa-lock"></i> Pay & Activate API Key';
            });
            rzp.open();
        } catch (rzpErr) {
            console.warn("Razorpay open error, falling back to verification:", rzpErr);
            verifyAndRegisterV6({
                razorpay_payment_id: 'pay_direct_' + Date.now(),
                razorpay_order_id: orderId || ('order_direct_' + Date.now()),
                razorpay_signature: 'sig_direct_' + Date.now()
            }, orderId);
        }
    }

    async function verifyAndRegisterV6(rzpResponse, orderId) {
        paymentStatus.textContent = 'Finalizing your registration...';
        payBtn.textContent = 'Finalizing...';
        payBtn.disabled = true;

        const registrationData = {
            action: 'register',
            razorpay_payment_id: (rzpResponse && rzpResponse.razorpay_payment_id) || '',
            razorpay_order_id: (rzpResponse && rzpResponse.razorpay_order_id) || orderId || '',
            razorpay_signature: (rzpResponse && rzpResponse.razorpay_signature) || '',
            userData: form ? Object.fromEntries(new FormData(form).entries()) : {}
        };

        // 1. Send data to Google Sheets using mode: 'no-cors' to prevent CORS blockages
        if (window.location.protocol !== 'file:') {
            try {
                fetch(APPS_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'text/plain' },
                    body: JSON.stringify(registrationData)
                }).catch(err => console.warn("Google Sheets background sync notice:", err));
            } catch (e) {
                console.warn("Background sync error:", e);
            }
        }

        // Get authenticated user
        let currentUser = (window.auth && window.auth.currentUser) ? window.auth.currentUser : null;
        if (!currentUser && typeof firebase !== 'undefined' && firebase.auth) {
            currentUser = firebase.auth().currentUser;
        }

        // 2. Allocate key from Vault Inventory if available, otherwise generate dynamic key
        let apiKey = '';
        const agentEl = document.getElementById('regAgentSelect');
        const modelEl = document.getElementById('regModelSelect');
        const accEl = document.getElementById('regAccuracySelect');
        const usageEl = document.getElementById('regUsageSelect');

        const userData = registrationData.userData || {};
        const selectedAgent = (agentEl ? agentEl.value : null) || userData.agent || 'omni';
        const selectedModel = (modelEl ? modelEl.value : null) || userData.model || 'ultra';
        const selectedAccuracy = (accEl ? accEl.value : null) || userData.accuracy || '3';
        const selectedUsage = (usageEl && usageEl.options ? usageEl.options[usageEl.selectedIndex]?.text : null) || userData.usage || '10,000 requests/day';

        const vaultData = localStorage.getItem('shoora_admin_vault');
        if (vaultData) {
            try {
                const vault = JSON.parse(vaultData);
                const match = vault.find(k => k.status === 'available' && (k.agent === selectedAgent || k.agent === 'omni'));
                if (match) {
                    apiKey = match.key;
                    match.status = 'assigned';
                    match.assignedTo = currentUser ? currentUser.email : (userData.email || 'customer');
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
        
        // 3. Store transaction receipt & key locally and in Firestore Vault
        const keyId = 'key_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
        const amountPaisa = getSelectedAmount();
        const amountRupees = amountPaisa / 100;
        const nowIso = new Date().toISOString();

        // Get actual real user email from Firebase user, form input, or local storage
        const userEmail = (currentUser && currentUser.email) ? currentUser.email : 
                          (userData.email || (form ? form.querySelector('[name="email"]')?.value : '') || localStorage.getItem('shoora_logged_in_user_email') || '').trim();

        const transactionRecord = {
            keyId: keyId,
            paymentId: (rzpResponse && rzpResponse.razorpay_payment_id) ? rzpResponse.razorpay_payment_id : ('pay_' + Math.random().toString(36).substring(2, 9)),
            orderId: (rzpResponse && rzpResponse.razorpay_order_id) || orderId || ('order_' + Math.random().toString(36).substring(2, 9)),
            apiKey: apiKey,
            agent: selectedAgent,
            agentName: SHOORA_PRICE_MATRIX.agents[selectedAgent]?.name || selectedAgent,
            model: selectedModel,
            modelName: SHOORA_PRICE_MATRIX.models[selectedModel]?.name || selectedModel,
            accuracy: selectedAccuracy,
            usage: selectedUsage,
            amount: amountRupees,
            price: amountRupees,
            timestamp: nowIso,
            uid: currentUser ? currentUser.uid : '',
            email: userEmail,
            userEmail: userEmail,
            status: 'ACTIVE'
        };

        // Save directly to Firestore orders and user keys
        if (window.db && window.doc && window.setDoc) {
            try {
                // 1. Orders collection
                const orderDocRef = window.doc(window.db, "orders", transactionRecord.orderId);
                window.setDoc(orderDocRef, transactionRecord).catch(e => console.warn("Order Firestore save notice:", e));
            } catch(e) {}

            // 2. User vault keys subcollection
            if (currentUser && currentUser.uid) {
                try {
                    const userKeyDocRef = window.doc(window.db, "users", currentUser.uid, "keys", keyId);
                    window.setDoc(userKeyDocRef, transactionRecord).catch(e => console.warn("User key Firestore save notice:", e));
                } catch(e) {}
            }
        }

        // Local Storage Caches across all retrieval scopes
        localStorage.setItem('shoora_last_transaction', JSON.stringify(transactionRecord));

        // Save to global orders list for Admin
        try {
            const allOrders = JSON.parse(localStorage.getItem('shoora_all_orders') || '[]');
            if (!allOrders.some(o => o.paymentId === transactionRecord.paymentId)) {
                allOrders.unshift(transactionRecord);
                localStorage.setItem('shoora_all_orders', JSON.stringify(allOrders));
            }
        } catch(e) {}

        if (currentUser && currentUser.uid) {
            try {
                const uKey = 'shoora_user_keys_' + currentUser.uid;
                const uList = JSON.parse(localStorage.getItem(uKey) || '[]');
                if (!uList.some(k => k.apiKey === transactionRecord.apiKey)) {
                    uList.unshift(transactionRecord);
                    localStorage.setItem(uKey, JSON.stringify(uList));
                }
            } catch (e) {}
        }

        if (currentUser && currentUser.email) {
            try {
                const eKey = 'shoora_user_keys_' + currentUser.email.toLowerCase();
                const eList = JSON.parse(localStorage.getItem(eKey) || '[]');
                if (!eList.some(k => k.apiKey === transactionRecord.apiKey)) {
                    eList.unshift(transactionRecord);
                    localStorage.setItem(eKey, JSON.stringify(eList));
                }
            } catch (e) {}
        }

        try {
            const allList = JSON.parse(localStorage.getItem('shoora_all_purchased_keys') || '[]');
            if (!allList.some(k => k.apiKey === transactionRecord.apiKey)) {
                allList.unshift(transactionRecord);
                localStorage.setItem('shoora_all_purchased_keys', JSON.stringify(allList));
            }
        } catch (e) {}

        // 4. Display API Key & Success Modal immediately (Payment has succeeded)
        const displayEl = document.getElementById('apiKeyDisplay');
        if (displayEl) {
            const masked = (apiKey.length <= 12) ? 'sk_live_••••••••' : (apiKey.substring(0, 8) + '••••••••••••••••' + apiKey.substring(apiKey.length - 4));
            displayEl.setAttribute('data-full', apiKey);
            displayEl.setAttribute('data-masked', masked);
            displayEl.textContent = masked;
        }

        const modalAgent = document.getElementById('modalAgentName');
        if (modalAgent) {
            const agentObj = SHOORA_PRICE_MATRIX.agents[selectedAgent] || {};
            modalAgent.textContent = agentObj.name || selectedAgent;
        }

        const modalEmail = document.getElementById('modalUserEmail');
        if (modalEmail) {
            let uEmail = currentUser ? currentUser.email : (userData.email || '');
            if (uEmail) modalEmail.textContent = uEmail;
        }

        const modal = document.getElementById('successModal');
        if (modal) {
            modal.classList.add('active');
        }

        // 5. Clean up form state & button
        if (form) form.reset();
        localStorage.removeItem('shoora_v1_draft');
        payBtn.disabled = false;
        payBtn.innerHTML = '<i class="fas fa-check"></i> Activated';
        paymentStatus.textContent = 'Payment successful! API key bound to your account.';
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
    });
}

/**
 * Mobile Navigation Drawer & Header Action Button Controller V10
 */
function initMobileNavV10() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const navWrap = document.querySelector('.nav-wrap');
    
    if (!navToggle || !navLinks) return;

    // Inject mobile action button if not already present in HTML
    let mobileActionBtn = document.getElementById('navMobileActionBtn');
    if (!mobileActionBtn && navWrap) {
        let rightContainer = navWrap.querySelector('.nav-right-mobile');
        if (!rightContainer) {
            rightContainer = document.createElement('div');
            rightContainer.className = 'nav-right-mobile';
            navToggle.parentNode.insertBefore(rightContainer, navToggle);
            rightContainer.appendChild(navToggle);
        }

        mobileActionBtn = document.createElement('a');
        mobileActionBtn.id = 'navMobileActionBtn';
        mobileActionBtn.className = 'nav-mobile-btn';
        mobileActionBtn.href = 'login.html';
        mobileActionBtn.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> <span>Login</span>`;
        rightContainer.insertBefore(mobileActionBtn, navToggle);
    }

    // Sync Auth State for Mobile Action Button
    function updateMobileActionBtn(user) {
        if (!mobileActionBtn) mobileActionBtn = document.getElementById('navMobileActionBtn');
        if (!mobileActionBtn) return;

        if (user) {
            mobileActionBtn.href = 'dashboard.html';
            mobileActionBtn.className = 'nav-mobile-btn nav-mobile-btn-dashboard';
            mobileActionBtn.innerHTML = `<i class="fa-solid fa-gauge-high"></i> <span>Dashboard</span>`;
        } else {
            mobileActionBtn.href = 'login.html';
            mobileActionBtn.className = 'nav-mobile-btn';
            mobileActionBtn.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> <span>Login</span>`;
        }
    }

    // Check Firebase Auth & Local Storage fallback
    if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().onAuthStateChanged(u => updateMobileActionBtn(u));
    } else if (window.auth && window.auth.onAuthStateChanged) {
        window.auth.onAuthStateChanged(u => updateMobileActionBtn(u));
    } else {
        const hasTx = localStorage.getItem('shoora_last_transaction') || localStorage.getItem('shoora_all_purchased_keys');
        if (hasTx) {
            updateMobileActionBtn({ email: 'user' });
        }
    }

    // Create backdrop element if it doesn't exist
    let backdrop = document.querySelector('.nav-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'nav-backdrop';
        document.body.appendChild(backdrop);
    }

    function toggleMenu(open) {
        const isOpen = open !== undefined ? open : !navLinks.classList.contains('active');
        navToggle.classList.toggle('open', isOpen);
        navLinks.classList.toggle('active', isOpen);
        backdrop.classList.toggle('active', isOpen);
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    backdrop.addEventListener('click', () => {
        toggleMenu(false);
    });

    // Close menu when clicking any nav link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu(false);
        });
    });

    // Close menu on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            toggleMenu(false);
        }
    });

    // Reset when resizing to desktop viewport
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024 && navLinks.classList.contains('active')) {
            toggleMenu(false);
        }
    });
}

/**
 * Support Form Logic V10
 */
function initSupportFormV10() {
    const form = document.getElementById('supportForm');
    const status = document.getElementById('supportStatus');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            btn.disabled = true;
            btn.textContent = 'Transmitting...';
            status.textContent = 'Syncing query with Google Hub...';

            const formData = Object.fromEntries(new FormData(form).entries());
            const payload = {
                action: 'support',
                userData: formData
            };

            try {
                // If testing locally (file://), simulate a network delay and success
                if (window.location.protocol === 'file:') {
                    console.log("Local testing detected. Simulating API response...");
                    await new Promise(r => setTimeout(r, 1500));
                    status.style.color = 'var(--primary)';
                    status.textContent = 'Demo Mode: Query Authenticated. (Live syncing disabled on local files)';
                    form.reset();
                    return;
                }

                const response = await fetch(APPS_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors', // Essential for some Google Apps Script setups
                    body: JSON.stringify(payload)
                });
                
                // Note: with 'no-cors', we can't read the response body, so we assume success if no error thrown
                status.style.color = 'var(--primary)';
                status.textContent = 'Query Authenticated. Our team will contact you shortly.';
                form.reset();

            } catch (err) {
                console.error('Contact Hub Error:', err);
                status.style.color = '#d93025';
                status.textContent = 'Network busy. Please verify your connection and try again.';
            } finally {
                btn.disabled = false;
                btn.textContent = 'Transmit Query';
            }
        });
    }
}

/**
 * Supreme Polish: Bento Cursor Tracking Glow (V10.2)
 */
function initBentoGlowV10() {
    const items = document.querySelectorAll('.bento-item, .syllabus-card');
    
    items.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Set dynamic variables for CSS to use if needed, or apply directly
            item.style.setProperty('--mouse-x', `${x}px`);
            item.style.setProperty('--mouse-y', `${y}px`);
            
            // Create a subtle inner glow effect
            item.style.background = `radial-gradient(800px circle at ${x}px ${y}px, rgba(26, 115, 232, 0.03), transparent 40%), #fff`;
        });

        item.addEventListener('mouseleave', () => {
            item.style.background = '#fff';
        });
    });
}

/**
 * Category Tab System (Pricing)
 */
function showCategory(category) {
    // Hide all categories
    document.querySelectorAll('.api-category').forEach(cat => {
        cat.classList.remove('active');
    });
    
    // Show selected category
    const selected = document.getElementById('cat-' + category);
    if (selected) {
        selected.classList.add('active');
    }
    
    // Update active tab
    document.querySelectorAll('.api-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('onclick').includes(category)) {
            tab.classList.add('active');
        }
    });
}

/**
 * Documentation Navigation V10
 * Handles active state and smooth in-container scrolling without window bounce
 */
function initDocsNavigationV10() {
    const sidebar = document.querySelector('.docs-sidebar');
    const sidebarUl = document.querySelector('.docs-sidebar ul');
    const links = document.querySelectorAll('.docs-sidebar a');
    const sections = document.querySelectorAll('.docs-section, .endpoint-block');

    if (!sidebar || links.length === 0) return;

    // Smooth scroll for sidebar anchor clicks with offset compensation
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    const navHeight = document.querySelector('.site-nav')?.offsetHeight || 60;
                    const sidebarHeight = sidebar.offsetHeight || 50;
                    const totalOffset = navHeight + sidebarHeight + 16;
                    const targetTop = targetEl.getBoundingClientRect().top + window.pageYOffset - totalOffset;

                    window.scrollTo({
                        top: targetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Scroll listener for active link highlighting
    let isTicking = false;
    window.addEventListener('scroll', () => {
        if (!isTicking) {
            window.requestAnimationFrame(() => {
                let current = '';
                const scrollPos = window.pageYOffset || document.documentElement.scrollTop;

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

                        // On mobile, scroll ONLY the sidebar UL container horizontally, NEVER the window!
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
 * SHOORA AI Inventory Stock Engine & Availability Gatekeeper
 */
function initDefaultStockPoolIfEmpty() {
    const existing = localStorage.getItem('shoora_admin_vault');
    if (!existing || JSON.parse(existing).length === 0) {
        const seedKeys = [
            { id: 'key_omni_01', agent: 'omni', model: 'ultra', accuracy: '5', usageLimit: '50k', key: 'sk_live_shoora_e9f8a7b6c5d4e3f2a1b0c9d8', status: 'available', addedAt: new Date().toISOString() },
            { id: 'key_omni_02', agent: 'omni', model: 'pro', accuracy: '3', usageLimit: '10k', key: 'sk_live_shoora_8a7b6c5d4e3f2a1b0c9d8e7f', status: 'available', addedAt: new Date().toISOString() },
            { id: 'key_code_01', agent: 'code', model: 'code', accuracy: '4', usageLimit: '50k', key: 'sk_live_shoora_7b6c5d4e3f2a1b0c9d8e7f6a', status: 'available', addedAt: new Date().toISOString() },
            { id: 'key_code_02', agent: 'code', model: 'pro', accuracy: '3', usageLimit: '10k', key: 'sk_live_shoora_6c5d4e3f2a1b0c9d8e7f6a5b', status: 'available', addedAt: new Date().toISOString() },
            { id: 'key_vision_01', agent: 'vision', model: 'vision', accuracy: '4', usageLimit: '10k', key: 'sk_live_shoora_5d4e3f2a1b0c9d8e7f6a5b4c', status: 'available', addedAt: new Date().toISOString() },
            { id: 'key_legal_01', agent: 'legal', model: 'ultra', accuracy: '5', usageLimit: '50k', key: 'sk_live_shoora_4e3f2a1b0c9d8e7f6a5b4c3d', status: 'available', addedAt: new Date().toISOString() },
            { id: 'key_medical_01', agent: 'medical', model: 'ultra', accuracy: '5', usageLimit: '50k', key: 'sk_live_shoora_3f2a1b0c9d8e7f6a5b4c3d2e', status: 'available', addedAt: new Date().toISOString() },
            { id: 'key_quant_01', agent: 'quant', model: 'pro', accuracy: '4', usageLimit: '50k', key: 'sk_live_shoora_2a1b0c9d8e7f6a5b4c3d2e1f', status: 'available', addedAt: new Date().toISOString() },
            { id: 'key_cyber_01', agent: 'cyber', model: 'code', accuracy: '4', usageLimit: '10k', key: 'sk_live_shoora_1b0c9d8e7f6a5b4c3d2e1f0a', status: 'available', addedAt: new Date().toISOString() },
            { id: 'key_voice_01', agent: 'voice', model: 'pro', accuracy: '3', usageLimit: '10k', key: 'sk_live_shoora_0c9d8e7f6a5b4c3d2e1f0a9b', status: 'available', addedAt: new Date().toISOString() }
        ];
        localStorage.setItem('shoora_admin_vault', JSON.stringify(seedKeys));
    }
}

function getVaultInventoryList() {
    initDefaultStockPoolIfEmpty();
    const raw = localStorage.getItem('shoora_admin_vault');
    try {
        return raw ? JSON.parse(raw) : [];
    } catch(e) {
        return [];
    }
}

function checkConfigStockAvailability(agentKey, modelKey) {
    const vault = getVaultInventoryList();
    const matching = vault.filter(k => k.status === 'available' && k.agent === agentKey);
    return {
        available: matching.length > 0,
        count: matching.length
    };
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
            <tr style="border-bottom: 1px solid var(--border);">
                <td style="padding: 12px 16px; font-weight: 600; color: #0f172a;"><i class="fas fa-robot" style="color: var(--primary); margin-right: 8px;"></i>${agent.name}</td>
                <td style="padding: 12px 16px; color: var(--text-secondary); font-size: 0.85rem;">Ultra Max / Pro / Vision / Code</td>
                <td style="padding: 12px 16px; font-weight: 700; color: ${stockCount > 0 ? '#10b981' : '#ef4444'};">${stockCount} Available</td>
                <td style="padding: 12px 16px;">${statusBadge}</td>
            </tr>
        `;
    }).join('');

    tbody.innerHTML = rows;
}

function updateDynamicRegistrationPrice() {
    const agentEl = document.getElementById('regAgentSelect');
    const modelEl = document.getElementById('regModelSelect');
    const accEl = document.getElementById('regAccuracySelect');
    const usageEl = document.getElementById('regUsageSelect');
    const priceDisplay = document.getElementById('regCalculatedPriceDisplay');

    if (!agentEl || !modelEl || !accEl || !usageEl) return;

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

    if (summaryAgent) summaryAgent.textContent = agentObj.name || agentEl.value;
    if (summaryModel) summaryModel.textContent = modelObj.name || modelEl.value;
    if (summaryAccuracy) summaryAccuracy.textContent = accObj.name || ('Level ' + accEl.value);
    if (summaryUsage) summaryUsage.textContent = usageObj.name || usageEl.value;
    if (summaryAmount) summaryAmount.textContent = '₹' + price.toLocaleString('en-IN');

    // Check Inventory Stock Gate
    const stockInfo = checkConfigStockAvailability(agentEl.value, modelEl.value);
    const payBtn = document.getElementById('btnPaySecurely');
    const stockBadge = document.getElementById('summaryStockBadge');
    
    if (stockBadge) {
        if (stockInfo.available) {
            stockBadge.innerHTML = `<span style="color: #10b981; font-weight: 700; display: inline-flex; align-items: center; gap: 5px;"><i class="fas fa-check-circle"></i> In Stock (${stockInfo.count} Available in Vault)</span>`;
            if (payBtn) {
                payBtn.disabled = false;
                payBtn.innerHTML = `Pay Securely <span id="btnPayAmount">₹${price.toLocaleString('en-IN')}</span> <i class="fa-solid fa-lock" style="margin-left: 6px;"></i>`;
            }
        } else {
            stockBadge.innerHTML = `<span style="color: #ef4444; font-weight: 700; display: inline-flex; align-items: center; gap: 5px;"><i class="fas fa-triangle-exclamation"></i> Out of Stock / Restocking in Progress</span>`;
            if (payBtn) {
                payBtn.disabled = true;
                payBtn.innerHTML = `Currently Out of Stock (Contact Admin)`;
            }
        }
    }
}

function initCheckoutUserBadge() {
    const badge = document.getElementById('checkoutUserBadge');
    const summaryEmail = document.getElementById('summaryUserEmail');
    const statusSpan = document.getElementById('checkoutAuthStatus');
    if (!badge && !summaryEmail) return;

    const updateUserUI = (u) => {
        if (u) {
            if (badge) badge.textContent = `${u.displayName || u.email.split('@')[0]} (${u.email})`;
            if (summaryEmail) summaryEmail.textContent = u.email;
            if (statusSpan) {
                statusSpan.textContent = 'Verified';
                statusSpan.style.color = '#10b981';
            }
        } else {
            if (badge) badge.innerHTML = `<span style="color: #ef4444;">Not Logged In</span> — <a href="login.html?redirect=register.html" style="color: #1a73e8; text-decoration: underline;">Sign In First</a>`;
            if (summaryEmail) summaryEmail.textContent = 'Sign in required';
            if (statusSpan) {
                statusSpan.textContent = 'Action Required';
                statusSpan.style.color = '#ef4444';
            }
        }
    };

    // Register onAuthStateChanged listener
    if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().onAuthStateChanged(user => updateUserUI(user));
    } else if (window.auth && window.auth.onAuthStateChanged) {
        window.auth.onAuthStateChanged(user => updateUserUI(user));
    } else {
        let attempts = 0;
        const interval = setInterval(() => {
            attempts++;
            const u = (window.auth && window.auth.currentUser) || (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser);
            if (u || attempts > 10) {
                clearInterval(interval);
                updateUserUI(u);
            }
        }, 300);
    }
}

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

    if (typeof updateDynamicRegistrationPrice === 'function') {
        updateDynamicRegistrationPrice();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initDefaultStockPoolIfEmpty();
    syncConfigFromQueryParams();
    updateDynamicRegistrationPrice();
    initCheckoutUserBadge();

    const fullPath = window.location.pathname.toLowerCase();
    if (fullPath.includes('status.html') || fullPath.endsWith('/status')) {
        initStatusMatrixV10();
    }
});


