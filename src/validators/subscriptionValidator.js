const VALID_BILLING_CYCLES = ['weekly', 'monthly', 'yearly'];
const VALID_STATUSES = ['active', 'paused', 'cancelled'];

function isValidIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

function validateSubscriptionInput(input) {
  const errors = [];
  const value = {
    name: String(input.name || '').trim(),
    category: String(input.category || '').trim(),
    price: Number(input.price),
    billingCycle: String(input.billingCycle || '').trim(),
    nextPaymentDate: String(input.nextPaymentDate || '').trim(),
    status: String(input.status || 'active').trim(),
    paymentMethod: String(input.paymentMethod || '').trim(),
    notes: String(input.notes || '').trim()
  };

  if (value.name.length < 2) {
    errors.push('Subscription name must be at least 2 characters.');
  }

  if (value.category.length < 2) {
    errors.push('Category must be at least 2 characters.');
  }

  if (!Number.isFinite(value.price) || value.price <= 0) {
    errors.push('Price must be greater than zero.');
  }

  if (!VALID_BILLING_CYCLES.includes(value.billingCycle)) {
    errors.push('Billing cycle must be weekly, monthly, or yearly.');
  }

  if (!isValidIsoDate(value.nextPaymentDate)) {
    errors.push('Next payment date must be a valid date in YYYY-MM-DD format.');
  }

  if (!VALID_STATUSES.includes(value.status)) {
    errors.push('Status must be active, paused, or cancelled.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    value
  };
}

function validateSubscriptionFilters(query) {
  const errors = [];
  const filters = {
    search: String(query.search || '').trim(),
    category: String(query.category || '').trim(),
    status: String(query.status || '').trim()
  };

  if (filters.status && !VALID_STATUSES.includes(filters.status)) {
    errors.push('Status filter must be active, paused, or cancelled.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: filters
  };
}

module.exports = {
  VALID_BILLING_CYCLES,
  VALID_STATUSES,
  validateSubscriptionInput,
  validateSubscriptionFilters,
  isValidIsoDate
};
