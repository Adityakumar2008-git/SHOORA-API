/**
 * SHOORA AI Platform — Modular Firebase Web SDK v10 Initialization
 * Integrates Firebase Auth & Cloud Firestore with Global Navbar State Management
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signInWithPopup, 
    signInAnonymously,
    GoogleAuthProvider, 
    signOut, 
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    getDocs, 
    query, 
    where, 
    addDoc,
    serverTimestamp,
    updateDoc,
    deleteDoc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase App Configuration (Project: shoraai)
const firebaseConfig = {
  apiKey: "AIzaSyCP-3cBN-UACDgmrL3lZAC9Tz6qnpeP6VU",
  authDomain: "shoraai.firebaseapp.com",
  projectId: "shoraai",
  storageBucket: "shoraai.firebasestorage.app",
  messagingSenderId: "575119680760",
  appId: "1:575119680760:web:14979508fbfa498b58470d",
  measurementId: "G-BDZKB9RMNQ"
};

// Initialize Firebase Core Services
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Export Firebase Auth & Firestore Helper Functions for Global Access
export {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signInAnonymously,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    updateProfile,
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    query,
    where,
    addDoc,
    serverTimestamp,
    updateDoc,
    deleteDoc,
    onSnapshot
};

// Expose on window for global script accessibility
if (typeof window !== 'undefined') {
    window.auth = auth;
    window.db = db;
    window.googleProvider = googleProvider;
    window.signInAnonymously = signInAnonymously;
    window.collection = collection;
    window.doc = doc;
    window.setDoc = setDoc;
    window.getDoc = getDoc;
    window.getDocs = getDocs;
    window.addDoc = addDoc;
    window.deleteDoc = deleteDoc;
    window.onSnapshot = onSnapshot;
    window.serverTimestamp = serverTimestamp;
    window.signOut = signOut;
    window.onAuthStateChanged = onAuthStateChanged;
}

// Global Real-Time Cloud Security Policy Listener (Instant Push across all domains)
function initRealtimeSecurityListener() {
    if (db && doc && onSnapshot) {
        try {
            onSnapshot(doc(db, "platform_security", "suspensions"), (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.data();
                    const suspendedList = (data.suspendedEmails || []).map(e => (e || '').toLowerCase().trim());
                    const revokedList = (data.revokedKeys || []).map(k => (k || '').trim());
                    
                    localStorage.setItem('shoora_suspended_users', JSON.stringify(suspendedList));
                    localStorage.setItem('shoora_revoked_keys', JSON.stringify(revokedList));

                    // Check if current session belongs to a suspended account
                    const currentUser = auth.currentUser;
                    const cachedEmail = (localStorage.getItem('shoora_logged_in_user_email') || '').toLowerCase();
                    const activeEmail = (currentUser && currentUser.email) ? currentUser.email.toLowerCase() : cachedEmail;

                    if (activeEmail && suspendedList.includes(activeEmail)) {
                        console.warn("Real-time Security Policy: Account is SUSPENDED. Forcing instant eviction.");
                        localStorage.removeItem('shoora_logged_in_user_email');
                        signOut(auth).then(() => {
                            if (!window.location.pathname.includes('login.html')) {
                                window.location.href = 'login.html?suspended=true';
                            }
                        });
                    }
                }
            }, (error) => {
                console.warn("Realtime security listener notice:", error);
            });
        } catch(e) {}
    }
}
initRealtimeSecurityListener();

/**
 * Global Dynamic Navbar Auth Listener
 * Toggles between "Login / Sign Up" and "Dashboard" across all pages
 */
document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, (user) => {
        updateGlobalNavbarAuthUI(user);
    });
});

async function updateGlobalNavbarAuthUI(user) {
    const navCta = document.querySelector('.nav-cta');
    const navLinks = document.getElementById('navLinks');
    const mobileBtn = document.getElementById('navMobileActionBtn');

    if (user) {
        // Master Suspension Guard (Local Cache Check)
        let suspendedUsers = [];
        try {
            suspendedUsers = JSON.parse(localStorage.getItem('shoora_suspended_users') || '[]');
        } catch(e) {}

        if (user.email && suspendedUsers.includes(user.email.toLowerCase())) {
            console.warn("Account is SUSPENDED (Local Guard). Forcing immediate sign-out.");
            localStorage.removeItem('shoora_logged_in_user_email');
            signOut(auth).then(() => {
                if (!window.location.pathname.includes('login.html')) {
                    window.location.href = 'login.html?suspended=true';
                }
            });
            return;
        }

        // Master Suspension Guard (Cloud Firestore Real-Time Check)
        if (db && getDoc && doc) {
            try {
                // 1. Check Global Platform Security Suspensions Doc
                const secDoc = await getDoc(doc(db, "platform_security", "suspensions"));
                if (secDoc.exists()) {
                    const data = secDoc.data();
                    const cloudSuspended = (data.suspendedEmails || []).map(e => (e || '').toLowerCase().trim());
                    if (cloudSuspended.includes(user.email.toLowerCase().trim())) {
                        console.warn("Account is SUSPENDED (Cloud Security Policy). Evicting session.");
                        if (!suspendedUsers.includes(user.email.toLowerCase())) {
                            suspendedUsers.push(user.email.toLowerCase());
                            localStorage.setItem('shoora_suspended_users', JSON.stringify(suspendedUsers));
                        }
                        localStorage.removeItem('shoora_logged_in_user_email');
                        signOut(auth).then(() => {
                            if (!window.location.pathname.includes('login.html')) {
                                window.location.href = 'login.html?suspended=true';
                            }
                        });
                        return;
                    }
                }

                // 2. Check Individual User Profile Doc
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists() && userDoc.data().status === 'SUSPENDED') {
                    console.warn("Account is SUSPENDED (User Doc Status). Evicting session.");
                    if (!suspendedUsers.includes(user.email.toLowerCase())) {
                        suspendedUsers.push(user.email.toLowerCase());
                        localStorage.setItem('shoora_suspended_users', JSON.stringify(suspendedUsers));
                    }
                    localStorage.removeItem('shoora_logged_in_user_email');
                    signOut(auth).then(() => {
                        if (!window.location.pathname.includes('login.html')) {
                            window.location.href = 'login.html?suspended=true';
                        }
                    });
                    return;
                }
            } catch (err) {
                console.warn("Security cloud sync notice:", err);
            }
        }

        // Authenticated State -> Sync to Local Storage & Firestore Profile
        localStorage.setItem('shoora_logged_in_user_email', user.email);

        if (db && setDoc && doc) {
            try {
                const userRef = doc(db, "users", user.uid);
                setDoc(userRef, {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName || user.email.split('@')[0],
                    lastSeen: new Date().toISOString()
                }, { merge: true }).catch(err => console.warn("User profile sync notice:", err));
            } catch(e) {}
        }

        if (navCta) {
            navCta.href = 'dashboard.html';
            navCta.innerHTML = `<i class="fa-solid fa-gauge-high"></i> <span>Dashboard</span>`;
            navCta.classList.remove('active');
        }

        // Update Mobile Action Button to Dashboard
        if (mobileBtn) {
            mobileBtn.href = 'dashboard.html';
            mobileBtn.className = 'nav-mobile-btn nav-mobile-btn-dashboard';
            mobileBtn.innerHTML = `<i class="fa-solid fa-gauge-high"></i> <span>Dashboard</span>`;
        }

        // Add user email badge / quick sign-out link if not already present
        let userMenu = document.getElementById('navUserBadge');
        if (!userMenu && navLinks) {
            userMenu = document.createElement('div');
            userMenu.id = 'navUserBadge';
            userMenu.style.cssText = 'display: inline-flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--text-secondary); margin-left: 12px;';
            userMenu.innerHTML = `
                <span style="font-weight: 600; color: #1a73e8;"><i class="fas fa-user-circle"></i> ${user.displayName || user.email.split('@')[0]}</span>
                <button id="navSignOutBtn" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-weight: 600; font-size: 0.8rem;" title="Sign Out"><i class="fas fa-sign-out-alt"></i></button>
            `;
            navLinks.appendChild(userMenu);

            document.getElementById('navSignOutBtn')?.addEventListener('click', () => {
                localStorage.removeItem('shoora_logged_in_user_email');
                signOut(auth).then(() => window.location.href = 'index.html');
            });
        }
    } else {
        localStorage.removeItem('shoora_logged_in_user_email');
        // Logged Out State -> Display Login / Sign Up CTA
        if (navCta) {
            navCta.href = 'login.html';
            navCta.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> <span>Login / Sign Up</span>`;
        }

        // Update Mobile Action Button to Login
        if (mobileBtn) {
            mobileBtn.href = 'login.html';
            mobileBtn.className = 'nav-mobile-btn';
            mobileBtn.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> <span>Login</span>`;
        }
        
        const userMenu = document.getElementById('navUserBadge');
        if (userMenu) userMenu.remove();
    }

    // Direct Register Page Auth Notice Control
    const authNotice = document.getElementById('checkoutAuthNotice');
    const summaryUserEmail = document.getElementById('summaryUserEmail');
    if (user && user.email) {
        if (authNotice) authNotice.style.display = 'none';
        if (summaryUserEmail) summaryUserEmail.textContent = user.email;
    } else {
        if (authNotice) authNotice.style.display = 'flex';
        if (summaryUserEmail) summaryUserEmail.innerHTML = '<span style="color: #ef4444;">Login Required (<a href="login.html?redirect=register.html" style="color: #1a73e8; text-decoration: underline;">Sign In</a>)</span>';
    }

    // Immediately trigger checkout badge update if on register page
    if (typeof window.updateCheckoutUserUI === 'function') {
        window.updateCheckoutUserUI(user);
    }
}
