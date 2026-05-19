const authMessage = document.querySelector('#authMessage');
const loginForm = document.querySelector('#loginForm');
const registerForm = document.querySelector('#registerForm');
const tabButtons = document.querySelectorAll('[data-auth-tab]');

if (localStorage.getItem('token')) {
  window.location.href = '/';
}

tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const mode = button.dataset.authTab;
    tabButtons.forEach((item) => item.classList.toggle('active', item === button));
    loginForm.classList.toggle('hidden', mode !== 'login');
    registerForm.classList.toggle('hidden', mode !== 'register');
    authMessage.textContent = '';
  });
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(loginForm));
  await authenticate('/api/auth/login', payload);
});

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = Object.fromEntries(new FormData(registerForm));
  const payload = {
    ...formData,
    monthlyBudgetLimit: Number(formData.monthlyBudgetLimit || 0)
  };
  await authenticate('/api/auth/register', payload);
});

async function authenticate(url, payload) {
  try {
    authMessage.textContent = 'Please wait...';
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.details?.join(' ') || data.message || 'Authentication failed.');
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = '/';
  } catch (error) {
    authMessage.textContent = error.message;
  }
}
