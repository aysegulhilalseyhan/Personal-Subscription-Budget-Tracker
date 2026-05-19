const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || 'null');

if (!token) {
  window.location.href = '/auth.html';
}

const state = {
  subscriptions: [],
  stats: null
};

const elements = {
  userBadge: document.querySelector('#userBadge'),
  logoutButton: document.querySelector('#logoutButton'),
  monthlyTotal: document.querySelector('#monthlyTotal'),
  yearlyTotal: document.querySelector('#yearlyTotal'),
  budgetRemaining: document.querySelector('#budgetRemaining'),
  upcomingCount: document.querySelector('#upcomingCount'),
  budgetAlert: document.querySelector('#budgetAlert'),
  tableBody: document.querySelector('#subscriptionTableBody'),
  upcomingList: document.querySelector('#upcomingList'),
  categoryList: document.querySelector('#categoryList'),
  form: document.querySelector('#subscriptionForm'),
  formTitle: document.querySelector('#formTitle'),
  formMessage: document.querySelector('#formMessage'),
  cancelEditButton: document.querySelector('#cancelEditButton'),
  searchInput: document.querySelector('#searchInput'),
  categoryInput: document.querySelector('#categoryInput'),
  statusFilter: document.querySelector('#statusFilter')
};

elements.userBadge.textContent = user ? `${user.name} · Budget ${formatMoney(user.monthlyBudgetLimit)}` : '';

elements.logoutButton.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/auth.html';
});

elements.form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = Object.fromEntries(new FormData(elements.form));
  const payload = {
    name: formData.name,
    category: formData.category,
    price: Number(formData.price),
    billingCycle: formData.billingCycle,
    nextPaymentDate: formData.nextPaymentDate,
    status: formData.status,
    paymentMethod: formData.paymentMethod,
    notes: formData.notes
  };
  const id = formData.id;

  try {
    const response = await api(id ? `/api/subscriptions/${id}` : '/api/subscriptions', {
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify(payload)
    });
    elements.formMessage.textContent = id ? 'Subscription updated.' : 'Subscription saved.';
    resetForm();
    await refreshDashboard();
    return response;
  } catch (error) {
    elements.formMessage.textContent = error.message;
  }
});

elements.cancelEditButton.addEventListener('click', resetForm);

[elements.searchInput, elements.categoryInput, elements.statusFilter].forEach((input) => {
  input.addEventListener('input', debounce(refreshDashboard, 250));
});

refreshDashboard();

async function refreshDashboard() {
  const params = new URLSearchParams();

  if (elements.searchInput.value.trim()) params.set('search', elements.searchInput.value.trim());
  if (elements.categoryInput.value.trim()) params.set('category', elements.categoryInput.value.trim());
  if (elements.statusFilter.value) params.set('status', elements.statusFilter.value);

  const [subscriptionsData, statsData] = await Promise.all([
    api(`/api/subscriptions?${params.toString()}`),
    api('/api/stats')
  ]);

  state.subscriptions = subscriptionsData.subscriptions;
  state.stats = statsData.stats;
  render();
}

function render() {
  renderSummary();
  renderTable();
  renderInsights();
}

function renderSummary() {
  const stats = state.stats;

  elements.monthlyTotal.textContent = formatMoney(stats.monthlyTotal);
  elements.yearlyTotal.textContent = formatMoney(stats.yearlyTotal);
  elements.budgetRemaining.textContent = formatMoney(stats.budgetRemaining);
  elements.upcomingCount.textContent = String(stats.upcomingPayments.length);

  elements.budgetAlert.classList.toggle('hidden', !stats.isBudgetExceeded);
  elements.budgetAlert.textContent = stats.isBudgetExceeded
    ? `Monthly subscription spending is ${formatMoney(Math.abs(stats.budgetRemaining))} over the budget limit.`
    : '';
}

function renderTable() {
  elements.tableBody.innerHTML = '';

  if (state.subscriptions.length === 0) {
    elements.tableBody.innerHTML = '<tr><td colspan="7" class="empty-cell">No subscriptions found.</td></tr>';
    return;
  }

  state.subscriptions.forEach((subscription) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <strong>${escapeHtml(subscription.name)}</strong>
        <small>${escapeHtml(subscription.paymentMethod || 'No payment method')}</small>
      </td>
      <td>${escapeHtml(subscription.category)}</td>
      <td>${formatMoney(subscription.price)}</td>
      <td>${escapeHtml(subscription.billingCycle)}</td>
      <td>${escapeHtml(subscription.nextPaymentDate)}</td>
      <td><span class="status-pill ${subscription.status}">${escapeHtml(subscription.status)}</span></td>
      <td class="action-cell">
        <button class="ghost-button" type="button" data-action="edit" data-id="${subscription.id}">Edit</button>
        <button class="danger-button" type="button" data-action="delete" data-id="${subscription.id}">Delete</button>
      </td>
    `;
    elements.tableBody.appendChild(row);
  });

  elements.tableBody.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.id);
      const action = button.dataset.action;

      if (action === 'edit') startEdit(id);
      if (action === 'delete') deleteSubscription(id);
    });
  });
}

function renderInsights() {
  elements.upcomingList.innerHTML = '';
  elements.categoryList.innerHTML = '';

  if (state.stats.upcomingPayments.length === 0) {
    elements.upcomingList.innerHTML = '<li>No payments due in the next 7 days.</li>';
  } else {
    state.stats.upcomingPayments.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = `${item.name}: ${formatMoney(item.price)} in ${item.daysUntilPayment} day(s)`;
      elements.upcomingList.appendChild(li);
    });
  }

  const categories = Object.entries(state.stats.categoryTotals);

  if (categories.length === 0) {
    elements.categoryList.innerHTML = '<li>No active category spending yet.</li>';
  } else {
    categories.forEach(([category, amount]) => {
      const li = document.createElement('li');
      li.textContent = `${category}: ${formatMoney(amount)} / month`;
      elements.categoryList.appendChild(li);
    });
  }
}

function startEdit(id) {
  const subscription = state.subscriptions.find((item) => item.id === id);
  if (!subscription) return;

  elements.form.id.value = subscription.id;
  elements.form.name.value = subscription.name;
  elements.form.category.value = subscription.category;
  elements.form.price.value = subscription.price;
  elements.form.billingCycle.value = subscription.billingCycle;
  elements.form.nextPaymentDate.value = subscription.nextPaymentDate;
  elements.form.status.value = subscription.status;
  elements.form.paymentMethod.value = subscription.paymentMethod;
  elements.form.notes.value = subscription.notes;
  elements.formTitle.textContent = 'Edit subscription';
  elements.cancelEditButton.classList.remove('hidden');
  elements.formMessage.textContent = '';
}

async function deleteSubscription(id) {
  const confirmed = window.confirm('Delete this subscription?');
  if (!confirmed) return;

  try {
    await api(`/api/subscriptions/${id}`, { method: 'DELETE' });
    await refreshDashboard();
  } catch (error) {
    elements.formMessage.textContent = error.message;
  }
}

function resetForm() {
  elements.form.reset();
  elements.form.id.value = '';
  elements.form.status.value = 'active';
  elements.form.billingCycle.value = 'monthly';
  elements.formTitle.textContent = 'Add subscription';
  elements.cancelEditButton.classList.add('hidden');
}

async function api(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/auth.html';
    return undefined;
  }

  if (response.status === 204) {
    return {};
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.details?.join(' ') || data.message || 'Request failed.');
  }

  return data;
}

function formatMoney(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'TRY'
  }).format(Number(value || 0));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function debounce(callback, delay) {
  let timeoutId;

  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => callback(...args), delay);
  };
}
