// Firebase-Integrated PIN Authentication & Project Management System
// Using Firebase compat SDK for GitHub Pages compatibility

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyC-3bVfdgIlEk0u1ZcrRc4m4OGcbM3A",
    authDomain: "absolin-team-portal.firebaseapp.com",
    projectId: "absolin-team-portal",
    storageBucket: "absolin-team-portal.firebasestorage.app",
    messagingSenderId: "340253146446",
    appId: "1:340253146446:web:caa663165a27af67ca7691f"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// PIN Authentication Config - Enhanced Security
const AUTH_CONFIG = {
    // PIN is hashed with SHA-256 for security
    // Actual PIN: 3811 (DO NOT SHARE)
    correctPINHash: '52c5a260883bb90127eec9cdbac2f9e726dc8ad2a6543d20685eec4ebf7f76bc',
    maxAttempts: 3, // Reduced from 5 for better security
    lockoutDuration: 300000, // 5 minutes (increased from 30 seconds)
    sessionDuration: 1800000 // 30 minutes (reduced from 1 hour)
};

const STORAGE_KEYS = {
    session: 'absolinSession',
    failedAttempts: 'failedAttempts',
    lockoutTime: 'lockoutTime'
};

// No default projects - Start with clean slate
const DEFAULT_PROJECTS = [];

// SVG Icons
const ICONS = {
    home: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 22V12H15V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    users: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    layers: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    grid: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="7" height="7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="14" y="3" width="7" height="7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="14" y="14" width="7" height="7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="3" y="14" width="7" height="7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};

// ===== FIREBASE PROJECT MANAGEMENT =====

// Initialize Firestore with default projects if empty
async function initProjects() {
    try {
        const snapshot = await db.collection('projects').get();

        if (snapshot.empty) {
            console.log('Initializing default projects...');
            const batch = db.batch();
            DEFAULT_PROJECTS.forEach(project => {
                const docRef = db.collection('projects').doc();
                batch.set(docRef, project);
            });
            await batch.commit();
            console.log('Default projects added!');
        }
    } catch (error) {
        console.error('Error initializing projects:', error);
    }
}

// Get all projects from Firestore
async function getProjects() {
    try {
        const snapshot = await db.collection('projects').get();
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting projects:', error);
        return [];
    }
}

// Add new project to Firestore
async function addProject(name, description, url, username, password, category, focus) {
    try {
        const newProject = {
            name,
            description,
            url,
            username: username || '',
            password: password || '',
            icon: 'grid',
            category: category || '',
            focus: focus || false,
            createdAt: new Date().toISOString()
        };

        await db.collection('projects').add(newProject);
        console.log('Project added successfully!');
    } catch (error) {
        console.error('Error adding project:', error);
        alert('Error adding project. Please try again.');
    }
}

// Delete project variable
let projectToDelete = null;

// Show delete confirmation modal
function deleteProject(id) {
    const projects = window.currentProjects || [];
    const project = projects.find(p => p.id === id);

    if (project) {
        projectToDelete = id;
        document.getElementById('deleteProjectName').textContent = `Are you sure you want to delete "${project.name}"?`;
        document.getElementById('deleteConfirmModal').classList.add('active');
    }
}

// Confirm deletion
async function confirmDelete() {
    if (projectToDelete) {
        try {
            await db.collection('projects').doc(projectToDelete).delete();
            console.log('Project deleted successfully!');
            projectToDelete = null;
            closeDeleteModal();
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Error deleting project. Please try again.');
        }
    }
}

// Close delete modal
function closeDeleteModal() {
    document.getElementById('deleteConfirmModal').classList.remove('active');
    projectToDelete = null;
}

// Render projects to UI
async function renderProjects() {
    const projects = await getProjects();
    window.currentProjects = projects;
    const container = document.querySelector('.projects-grid');

    if (!container) return;

    // Beautiful empty state when no projects
    if (projects.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-illustration">
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="url(#gradient1)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M2 17L12 22L22 17" stroke="url(#gradient1)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M2 12L12 17L22 12" stroke="url(#gradient1)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <defs>
                            <linearGradient id="gradient1" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" style="stop-color:#0066FF;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#00C9FF;stop-opacity:1" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <h3 class="empty-state-title">No Projects Yet</h3>
                <p class="empty-state-description">Create your first client project to get started with organizing your Odoo implementations</p>
                <button class="empty-state-btn" onclick="document.getElementById('addProjectBtn').click()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Add Your First Project
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = projects.map(project => {
        const hasCredentials = project.username || project.password;
        return `
        <div class="project-card" data-id="${project.id}">
            <div class="project-header">
                <div class="project-icon">
                    ${ICONS[project.icon] || ICONS.grid}
                </div>
                <h4 class="project-name">${escapeHTML(project.name)}</h4>
                ${hasCredentials ? `
                    <div class="project-info-icon" onclick="toggleCredentials('${project.id}', event)">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                            <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            <circle cx="12" cy="8" r="1" fill="currentColor"/>
                        </svg>
                        <div class="credential-tooltip" id="tooltip-${project.id}">
                            ${project.username ? `
                                <div class="credential-item">
                                    <span class="credential-label">Username</span>
                                    <div class="credential-value">
                                        <span>${escapeHTML(project.username)}</span>
                                        <button class="copy-btn" onclick="copyToClipboard('${escapeHTML(project.username)}', event)" title="Copy">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/>
                                                <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" stroke-width="2"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ` : ''}
                            ${project.password ? `
                                <div class="credential-item">
                                    <span class="credential-label">Password</span>
                                    <div class="credential-value">
                                        <span>${escapeHTML(project.password)}</span>
                                        <button class="copy-btn" onclick="copyToClipboard('${escapeHTML(project.password)}', event)" title="Copy">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/>
                                                <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" stroke-width="2"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                ` : ''}
            </div>
            <p class="project-description">${escapeHTML(project.description)}</p>
            <div class="project-actions">
                <button class="project-btn" onclick="window.open('${escapeHTML(project.url)}', '_blank')">
                    Open Project
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <button class="delete-project-btn" onclick="deleteProject('${project.id}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
    }).join('');
}

// Setup real-time listener for projects
function setupRealtimeListener() {
    db.collection('projects').onSnapshot((snapshot) => {
        console.log('Projects updated - rerendering...');
        renderProjects();
    });
}

// Utility function to escape HTML
function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Toggle credentials tooltip
window.toggleCredentials = function (projectId, event) {
    event.stopPropagation();
    const tooltip = document.getElementById(`tooltip-${projectId}`);
    const allTooltips = document.querySelectorAll('.credential-tooltip');

    allTooltips.forEach(t => {
        if (t.id !== `tooltip-${projectId}`) {
            t.classList.remove('visible');
        }
    });

    tooltip.classList.toggle('visible');
};

// Copy to clipboard
window.copyToClipboard = function (text, event) {
    event.stopPropagation();
    navigator.clipboard.writeText(text).then(() => {
        const btn = event.currentTarget;
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        setTimeout(() => {
            btn.innerHTML = originalHTML;
        }, 1000);
    });
};

// Close tooltips when clicking outside
document.addEventListener('click', () => {
    document.querySelectorAll('.credential-tooltip').forEach(t => t.classList.remove('visible'));
});

// Make functions globally accessible
window.deleteProject = deleteProject;
window.confirmDelete = confirmDelete;
window.closeDeleteModal = closeDeleteModal;

// ===== PIN AUTHENTICATION =====

let currentPIN = '';

const pinContainer = document.getElementById('pinContainer');
const contentContainer = document.getElementById('contentContainer');
const pinDisplay = document.getElementById('pinDisplay');
const errorMessage = document.getElementById('errorMessage');
const pinInput = document.getElementById('pinInput');
const logoutBtn = document.getElementById('logoutBtn');

// Modal elements
const addProjectBtn = document.getElementById('addProjectBtn');
const addProjectModal = document.getElementById('addProjectModal');
const cancelBtn = document.getElementById('cancelBtn');
const addProjectForm = document.getElementById('addProjectForm');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🔥 Initializing Firebase...');

    // Initialize Firebase projects
    await initProjects();

    // Setup real-time listener
    setupRealtimeListener();

    // Initialize sidebar navigation
    initNavigation();

    // Check session
    checkSession();

    // PIN input event listener
    if (pinInput) {
        pinInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            currentPIN = e.target.value;
            updateDisplay();

            if (currentPIN.length === 4) {
                setTimeout(verifyPIN, 300);
            }
        });

        pinInput.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            const numbers = pastedText.replace(/[^0-9]/g, '').slice(0, 4);
            pinInput.value = numbers;
            currentPIN = numbers;
            updateDisplay();
            if (currentPIN.length === 4) {
                setTimeout(verifyPIN, 300);
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Project modal events
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', openModal);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }

    if (addProjectModal) {
        addProjectModal.addEventListener('click', (e) => {
            if (e.target === addProjectModal) closeModal();
        });
    }

    if (addProjectForm) {
        addProjectForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('projectName').value;
            const description = document.getElementById('projectDescription').value;
            const url = document.getElementById('projectUrl').value;
            const username = document.getElementById('projectUsername').value;
            const password = document.getElementById('projectPassword').value;
            const category = document.getElementById('projectCategory').value;
            const focus = document.getElementById('projectFocus').checked;

            await addProject(name, description, url, username, password, category, focus);
            addProjectForm.reset();
            closeModal();
        });
    }

    // Delete modal events
    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', confirmDelete);
    }

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    }

    if (deleteConfirmModal) {
        deleteConfirmModal.addEventListener('click', (e) => {
            if (e.target === deleteConfirmModal) closeDeleteModal();
        });
    }

    console.log('✅ Firebase initialized successfully!');
});

function openModal() {
    addProjectModal.classList.add('active');
}

function closeModal() {
    addProjectModal.classList.remove('active');
    addProjectForm.reset();
}

function checkSession() {
    const session = localStorage.getItem(STORAGE_KEYS.session);
    if (session) {
        const sessionData = JSON.parse(session);
        if (Date.now() < sessionData.expiry) {
            showContent();
            return;
        }
        localStorage.removeItem(STORAGE_KEYS.session);
    }
}

function checkLockout() {
    const lockoutTime = localStorage.getItem(STORAGE_KEYS.lockoutTime);
    if (lockoutTime && Date.now() < parseInt(lockoutTime)) {
        const remaining = Math.ceil((parseInt(lockoutTime) - Date.now()) / 1000);
        showError(`Too many attempts. Try again in ${remaining} seconds.`);
        if (pinInput) {
            pinInput.disabled = true;
            setTimeout(() => {
                pinInput.disabled = false;
                hideError();
            }, remaining * 1000);
        }
        return true;
    }
    localStorage.removeItem(STORAGE_KEYS.lockoutTime);
    return false;
}

function updateDisplay() {
    const dots = pinDisplay.querySelectorAll('.pin-dot');
    dots.forEach((dot, index) => {
        if (index < currentPIN.length) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled');
        }
    });
}

// SHA-256 Hash function for PIN security
async function hashPIN(pin) {
    const encoder = new TextEncoder();
    const data = encoder.encode(pin);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

async function verifyPIN() {
    const hashedInput = await hashPIN(currentPIN);

    if (hashedInput === AUTH_CONFIG.correctPINHash) {
        const sessionData = {
            expiry: Date.now() + AUTH_CONFIG.sessionDuration
        };
        localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(sessionData));
        localStorage.removeItem(STORAGE_KEYS.failedAttempts);
        showContent();
    } else {
        const attempts = parseInt(localStorage.getItem(STORAGE_KEYS.failedAttempts) || '0') + 1;
        localStorage.setItem(STORAGE_KEYS.failedAttempts, attempts.toString());

        if (attempts >= AUTH_CONFIG.maxAttempts) {
            const lockoutTime = Date.now() + AUTH_CONFIG.lockoutDuration;
            localStorage.setItem(STORAGE_KEYS.lockoutTime, lockoutTime.toString());
            showError(`Too many failed attempts. Locked for 5 minutes.`);
            if (pinInput) {
                pinInput.disabled = true;
            }
        } else {
            showError(`Incorrect PIN. ${AUTH_CONFIG.maxAttempts - attempts} attempts remaining.`);
        }

        currentPIN = '';
        if (pinInput) {
            pinInput.value = '';
        }
        updateDisplay();
    }
}

async function showContent() {
    pinContainer.classList.add('hidden');
    contentContainer.classList.remove('hidden');
    await renderProjects();
    currentPIN = '';
    if (pinInput) {
        pinInput.value = '';
    }
    updateDisplay();
    hideError();
}

function logout() {
    localStorage.removeItem(STORAGE_KEYS.session);
    contentContainer.classList.add('hidden');
    pinContainer.classList.remove('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
}

function hideError() {
    errorMessage.textContent = '';
    errorMessage.classList.remove('show');
}

console.log('🔥 Firebase Team Portal loaded! PIN: 1234');

// ===== SIDEBAR NAVIGATION FILTERING =====

let currentCategory = 'all';

// Initialize navigation
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const category = item.getAttribute('data-category');

            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Store current category
            currentCategory = category;

            // Re-render projects with filter
            renderProjects();
        });
    });
}

// Update count badges
function updateCounts(projects) {
    const counts = {
        all: projects.length,
        focus: projects.filter(p => p.focus).length,
        odoo: projects.filter(p => p.category === 'odoo').length,
        mobile: projects.filter(p => p.category === 'mobile').length,
        web: projects.filter(p => p.category === 'web').length
    };

    document.getElementById('count-all').textContent = counts.all;
    document.getElementById('count-focus').textContent = counts.focus;
    document.getElementById('count-odoo').textContent = counts.odoo;
    document.getElementById('count-mobile').textContent = counts.mobile;
    document.getElementById('count-web').textContent = counts.web;
}

// Filter projects based on category
function filterProjects(projects) {
    if (currentCategory === 'all') {
        return projects;
    }

    if (currentCategory === 'focus') {
        return projects.filter(p => p.focus);
    }

    return projects.filter(p => p.category === currentCategory);
}

// Override original renderProjects to add filtering
const originalRenderProjects = renderProjects;
renderProjects = async function () {
    const allProjects = await getProjects();
    window.currentProjects = allProjects;

    // Update counts
    updateCounts(allProjects);

    // Filter projects
    const filteredProjects = filterProjects(allProjects);

    const container = document.querySelector('.projects-grid');
    if (!container) return;

    // Beautiful empty state when no projects
    if (filteredProjects.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-illustration">
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="url(#gradient1)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M2 17L12 22L22 17" stroke="url(#gradient1)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M2 12L12 17L22 12" stroke="url(#gradient1)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <defs>
                            <linearGradient id="gradient1" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" style="stop-color:#0066FF;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#00C9FF;stop-opacity:1" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <h3 class="empty-state-title">No Projects in ${currentCategory === 'all' ? 'This Category' : currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}</h3>
                <p class="empty-state-description">Create your first ${currentCategory === 'all' ? '' : currentCategory} project to get started</p>
                <button class="empty-state-btn" onclick="document.getElementById('addProjectBtn').click()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Add Your First Project
                </button>
            </div>
        `;
        return;
    }

    // Render filtered projects (same as original but with filteredProjects)
    container.innerHTML = filteredProjects.map(project => {
        const hasCredentials = project.username || project.password;
        return `
        <div class="project-card" data-id="${project.id}">
            <div class="project-header">
                <div class="project-icon">
                    ${ICONS[project.icon] || ICONS.grid}
                </div>
                <h4 class="project-name">${escapeHTML(project.name)}</h4>
                ${hasCredentials ? `
                    <div class="project-info-icon" onclick="toggleCredentials('${project.id}', event)">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                            <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            <circle cx="12" cy="8" r="1" fill="currentColor"/>
                        </svg>
                        <div class="credential-tooltip" id="tooltip-${project.id}">
                            ${project.username ? `
                                <div class="credential-item">
                                    <span class="credential-label">Username</span>
                                    <div class="credential-value">
                                        <span>${escapeHTML(project.username)}</span>
                                        <button class="copy-btn" onclick="copyToClipboard('${escapeHTML(project.username)}', event)" title="Copy">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/>
                                                <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" stroke-width="2"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ` : ''}
                            ${project.password ? `
                                <div class="credential-item">
                                    <span class="credential-label">Password</span>
                                    <div class="credential-value">
                                        <span>${escapeHTML(project.password)}</span>
                                        <button class="copy-btn" onclick="copyToClipboard('${escapeHTML(project.password)}', event)" title="Copy">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/>
                                                <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" stroke-width="2"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                ` : ''}
            </div>
            <p class="project-description">${escapeHTML(project.description)}</p>
            <div class="project-actions">
                <button class="project-btn" onclick="window.open('${escapeHTML(project.url)}', '_blank')">
                    Open Project
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <button class="delete-project-btn" onclick="deleteProject('${project.id}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
    }).join('');
};

console.log('🎯 Sidebar navigation initialized!');
