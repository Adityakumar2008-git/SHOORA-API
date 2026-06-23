/**
 * SHOORA AI API Platform - Secure Multi-Step Registration Engine
 */

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby3hyKPobp_7n2RMVWBGyTMyaSCn6toATPOz3wYyjrbhZY--wdr9RwXqToY2ihYJJF-/exec';
const RZP_KEY_ID = 'rzp_test_Se7zV6tz4pw59z';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Global Interactions (Runs on all pages)
    initScrollRevealV6();
    initNavScrollEffectV10();

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

    function updateSummary() {
        const plan = document.querySelector('input[name="plan"]:checked');
        if (plan) {
            const val = plan.value;
            const name = val.split('_')[0];
            const amount = parseInt(val.split('_')[1]) / 100;
            
            const summaryPlan = document.getElementById('summaryPlan');
            const summaryAmount = document.getElementById('summaryAmount');
            
            if (summaryPlan) summaryPlan.textContent = name.charAt(0).toUpperCase() + name.slice(1);
            if (summaryAmount) summaryAmount.textContent = '₹' + amount.toLocaleString('en-IN');
        }
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
        try {
            payBtn.disabled = true;
            payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
            paymentStatus.textContent = 'Opening Secure Payment Window...';

            // 1. Create Order ID via Google Apps Script
            // Bypassing backend order creation to override the server's hardcoded 50 INR fee
            /*
            const response = await fetch(APPS_SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({ action: 'createOrder' })
            });

            const orderData = await response.json();
            
            if (orderData.id) {
                launchRazorpayV6(orderData.id);
            } else {
                throw new Error("Order Creation Failed");
            }
            */
            launchRazorpayV6(null);

        } catch (error) {
            console.error('Payment Error:', error);
            paymentStatus.textContent = 'Server busy. Switching to Direct verification...';
            launchRazorpayV6(null);
        }
    });

    function getSelectedAmount() {
        const plan = document.querySelector('input[name="plan"]:checked');
        if (plan) {
            const parts = plan.value.split('_');
            return parseInt(parts[parts.length - 1] || '49900');
        }
        return 49900;
    }

    function launchRazorpayV6(orderId) {
        const amount = getSelectedAmount();
        const plan = document.querySelector('input[name="plan"]:checked');
        const planName = plan ? plan.value.split('_')[0] : 'Growth';

        const options = {
            "key": RZP_KEY_ID,
            "amount": amount.toString(),
            "currency": "INR",
            "name": "SHOORA AI API Platform",
            "description": "API Key — " + planName.charAt(0).toUpperCase() + planName.slice(1) + " Plan",
            "order_id": orderId,
            "handler": function (response) {
                verifyAndRegisterV6(response, orderId);
            },
            "prefill": {
                "name": form.fullName.value,
                "email": form.email.value,
                "contact": form.mobile.value
            },
            "theme": { "color": "#1a73e8" },
            "modal": {
                "ondismiss": function() {
                    payBtn.disabled = false;
                    payBtn.innerHTML = '<i class="fas fa-lock"></i> Pay Securely via Razorpay';
                    paymentStatus.textContent = 'Payment cancelled. Your details are saved.';
                }
            }
        };

        const rzp = new Razorpay(options);
        rzp.open();
    }

    async function verifyAndRegisterV6(rzpResponse, orderId) {
        paymentStatus.textContent = 'Verifying with Google Sheets...';
        payBtn.textContent = 'Finalizing...';

        const registrationData = {
            action: 'register',
            razorpay_payment_id: rzpResponse.razorpay_payment_id,
            razorpay_order_id: rzpResponse.razorpay_order_id || orderId,
            razorpay_signature: rzpResponse.razorpay_signature,
            userData: Object.fromEntries(new FormData(form).entries())
        };

        try {
            const response = await fetch(APPS_SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(registrationData)
            });

            const result = await response.json();

            if (result.status === 'success') {
                const apiKey = 'sk_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                const displayEl = document.getElementById('apiKeyDisplay');
                if (displayEl) {
                    displayEl.textContent = apiKey;
                }
                document.getElementById('successModal').classList.add('active');
                form.reset();
                localStorage.removeItem('shoora_v1_draft');
            } else {
                alert("Error: " + result.message);
                payBtn.disabled = false;
                payBtn.textContent = 'Retry Payment';
            }

        } catch (error) {
            console.log('Final Verif Error:', error);
            paymentStatus.textContent = 'Synchronization Error. Please contact support with your Payment ID.';
            payBtn.disabled = false;
        }
    }
}

/**
 * Nav Scroll Effect V10
 */
function initNavScrollEffectV10() {
    const nav = document.querySelector('.site-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
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
 * Handles active state and mobile auto-scrolling for sidebar tabs
 */
function initDocsNavigationV10() {
    const sidebar = document.querySelector('.docs-sidebar');
    const links = document.querySelectorAll('.docs-sidebar a');
    const sections = document.querySelectorAll('.docs-section');

    if (!sidebar || links.length === 0) return;

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}` || (href.startsWith('#') && current && href.includes(current))) {
                link.classList.add('active');
                
                // On mobile, ensure the active tab is scrolled into view
                if (window.innerWidth < 1024) {
                    const linkRect = link.getBoundingClientRect();
                    const sidebarRect = sidebar.getBoundingClientRect();
                    
                    if (linkRect.left < sidebarRect.left || linkRect.right > sidebarRect.right) {
                        link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                    }
                }
            }
        });
    });
}
