const test = require('node:test');
const assert = require('node:assert/strict');
const {
  validateSubscriptionInput,
  validateSubscriptionFilters,
  isValidIsoDate
} = require('../src/validators/subscriptionValidator');

test('validateSubscriptionInput accepts a complete valid subscription', () => {
  const result = validateSubscriptionInput({
    name: 'Netflix',
    category: 'Entertainment',
    price: 120,
    billingCycle: 'monthly',
    nextPaymentDate: '2026-06-01',
    status: 'active',
    paymentMethod: 'Credit Card'
  });

  assert.equal(result.isValid, true);
  assert.equal(result.value.name, 'Netflix');
});

test('validateSubscriptionInput rejects missing and invalid fields', () => {
  const result = validateSubscriptionInput({
    name: '',
    category: 'E',
    price: -1,
    billingCycle: 'daily',
    nextPaymentDate: '2026-99-01',
    status: 'enabled'
  });

  assert.equal(result.isValid, false);
  assert.equal(result.errors.length, 6);
});

test('validateSubscriptionFilters rejects unknown status values', () => {
  const result = validateSubscriptionFilters({ status: 'archived' });
  assert.equal(result.isValid, false);
});

test('isValidIsoDate validates strict YYYY-MM-DD values', () => {
  assert.equal(isValidIsoDate('2026-05-19'), true);
  assert.equal(isValidIsoDate('2026-02-30'), false);
  assert.equal(isValidIsoDate('19-05-2026'), false);
});
