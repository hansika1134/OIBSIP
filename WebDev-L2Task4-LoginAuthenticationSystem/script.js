const USERS_KEY = 'oibsip_auth_users';
const SESSION_KEY = 'oibsip_auth_session';

// SHA-256 hashing using the Web Crypto API (no plain-text password storage)
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function isValidPassword(password) {
  return password.length >= 8 && /\d/.test(password);
}

function setSession(username) {
  sessionStorage.setItem(SESSION_KEY, username);
}

function getSession() {
  return sessionStorage.getItem(SESSION_KEY);
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

// ---------- Register page ----------
const registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorMsg = document.getElementById('error-msg');
    errorMsg.textContent = '';

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
      errorMsg.textContent = 'All fields are required.';
      return;
    }
    if (!isValidPassword(password)) {
      errorMsg.textContent = 'Password must be at least 8 characters and include a number.';
      return;
    }

    const users = getUsers();
    if (users[username]) {
      errorMsg.textContent = 'An account with that username/email already exists.';
      return;
    }

    const passwordHash = await hashPassword(password);
    users[username] = { passwordHash };
    saveUsers(users);

    setSession(username);
    window.location.href = 'dashboard.html';
  });
}

// ---------- Login page ----------
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorMsg = document.getElementById('error-msg');
    errorMsg.textContent = '';

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    const users = getUsers();
    const user = users[username];

    if (!user) {
      errorMsg.textContent = 'Invalid username/email or password.';
      return;
    }

    const passwordHash = await hashPassword(password);
    if (passwordHash !== user.passwordHash) {
      errorMsg.textContent = 'Invalid username/email or password.';
      return;
    }

    setSession(username);
    window.location.href = 'dashboard.html';
  });
}

// ---------- Dashboard page (protected) ----------
const welcomeMsg = document.getElementById('welcome-msg');
if (welcomeMsg) {
  const session = getSession();
  if (!session) {
    window.location.href = 'login.html';
  } else {
    welcomeMsg.textContent = `Logged in as ${session}`;
  }

  const logoutBtn = document.getElementById('logout-btn');
  logoutBtn.addEventListener('click', () => {
    clearSession();
    window.location.href = 'login.html';
  });
}
