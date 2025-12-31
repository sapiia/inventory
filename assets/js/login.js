// ==================== UTILITIES ====================
const showMessage = (text, type = 'info') => {
    const el = document.getElementById('messages');
    const bg = type === 'error' ? 'bg-red-100 text-red-700' :
               type === 'success' ? 'bg-green-100 text-green-700' :
               'bg-blue-50 text-blue-700';
    el.innerHTML = `<div class="p-3 rounded-lg text-sm ${bg}">${text}</div>`;
    setTimeout(() => el.innerHTML = '', 4500);
};

// ==================== LOCALSTORAGE USERS ====================
const loadUsers = () => {
    try { return JSON.parse(localStorage.getItem('inventory_users')) || []; }
    catch { return []; }
};

const saveUsers = (users) => {
    localStorage.setItem('inventory_users', JSON.stringify(users));
};

// ==================== FORM TOGGLE ====================
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const toggleBtn = document.getElementById('toggle-form-btn');
const toggleText = document.getElementById('toggle-text');
const formTitle = document.getElementById('form-title');

const switchToRegister = () => {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    toggleText.textContent = "Already have an account?";
    toggleBtn.textContent = "Sign in";
    formTitle.textContent = "Create your account";
};

const switchToLogin = () => {
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    toggleText.textContent = "Don't have an account?";
    toggleBtn.textContent = "Sign up";
    formTitle.textContent = "Sign in to continue";
};

toggleBtn.addEventListener('click', () => {
    if (loginForm.classList.contains('hidden')) switchToLogin();
    else switchToRegister();
});

// ==================== LOGIN ====================
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const identifier = document.getElementById('login-identifier').value.trim();
    const password = document.getElementById('login-password').value;
    const remember = document.getElementById('login-remember').checked;

    if (!identifier || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }

    const users = loadUsers();
    const user = users.find(u =>
        (u.email?.toLowerCase() === identifier.toLowerCase()) ||
        (u.username?.toLowerCase() === identifier.toLowerCase())
    );

    if (!user || user.password !== password) {
        showMessage('Invalid username/email or password', 'error');
        return;
    }

    // Success - store session
    const session = {
        username: user.username,
        name: user.name,
        email: user.email,
        loginTime: Date.now()
    };
    const token = btoa(JSON.stringify(session) + '::' + Date.now());

    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('inventory_user', JSON.stringify(session));
    storage.setItem('inventory_token', token);

    showMessage('Login successful! Redirecting...', 'success');
    setTimeout(() => window.location.href = 'dashboard_sec.html', 800);
});

// ==================== REGISTER ====================
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const username = document.getElementById('reg-username').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const password = document.getElementById('reg-password').value;

    if (!name || !email || !username || !password) {
        showMessage('Please fill all required fields', 'error');
        return;
    }

    const users = loadUsers();

    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        showMessage('Username already taken', 'error');
        return;
    }
    if (users.some(u => u.email?.toLowerCase() === email.toLowerCase())) {
        showMessage('Email already registered', 'error');
        return;
    }

    const newUser = {
        name,
        email,
        username,
        phone: phone || null,
        password, // In real app → hash this!
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    showMessage('Account created successfully! You can now sign in.', 'success');

    // Auto-fill login form & switch to login
    document.getElementById('login-identifier').value = username;
    switchToLogin();
});

// ==================== FORGOT PASSWORD ====================
const forgotModal = document.getElementById('forgot-modal');
document.getElementById('forgot-btn').addEventListener('click', () => forgotModal.classList.remove('hidden'));
document.getElementById('forgot-cancel').addEventListener('click', () => forgotModal.classList.add('hidden'));

document.getElementById('forgot-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const identifier = document.getElementById('forgot-identifier').value.trim();
    const newPassword = document.getElementById('forgot-newpass').value;

    if (!identifier || !newPassword) {
        showMessage('Please fill all fields', 'error');
        return;
    }

    const users = loadUsers();
    const userIndex = users.findIndex(u =>
        u.username.toLowerCase() === identifier.toLowerCase() ||
        u.email?.toLowerCase() === identifier.toLowerCase()
    );

    if (userIndex === -1) {
        showMessage('No account found with that username/email', 'error');
        return;
    }

    users[userIndex].password = newPassword;
    saveUsers(users);

    showMessage('Password has been reset! You can now login.', 'success');
    forgotModal.classList.add('hidden');

    document.getElementById('login-identifier').value = identifier;
    switchToLogin();
});

// Auto-redirect if already logged in
if (localStorage.getItem('inventory_token') || sessionStorage.getItem('inventory_token')) {
    window.location.href = 'dashboard_sec.html';
}