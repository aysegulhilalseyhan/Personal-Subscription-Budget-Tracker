function validateRegisterInput(input) {
  const errors = [];
  const name = String(input.name || '').trim();
  const email = String(input.email || '').trim().toLowerCase();
  const password = String(input.password || '');
  const monthlyBudgetLimit = Number(input.monthlyBudgetLimit || 0);

  if (name.length < 2) {
    errors.push('Name must be at least 2 characters.');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('A valid email is required.');
  }

  if (password.length < 6) {
    errors.push('Password must be at least 6 characters.');
  }

  if (!Number.isFinite(monthlyBudgetLimit) || monthlyBudgetLimit < 0) {
    errors.push('Monthly budget limit must be zero or a positive number.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: { name, email, password, monthlyBudgetLimit }
  };
}

function validateLoginInput(input) {
  const errors = [];
  const email = String(input.email || '').trim().toLowerCase();
  const password = String(input.password || '');

  if (!email) {
    errors.push('Email is required.');
  }

  if (!password) {
    errors.push('Password is required.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: { email, password }
  };
}

module.exports = {
  validateRegisterInput,
  validateLoginInput
};
