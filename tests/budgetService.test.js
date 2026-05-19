const test = require('node:test');
const assert = require('node:assert/strict');
const {
  calculateMonthlyCost,
  calculateYearlyCost,
  daysUntil,
  getRenewalStatus,
  calculateBudgetSummary
} = require('../src/services/budgetService');

test('calculateMonthlyCost converts weekly and yearly prices to monthly cost', () => {
  assert.equal(calculateMonthlyCost({ price: 10, billingCycle: 'weekly', status: 'active' }), 43.45);
  assert.equal(calculateMonthlyCost({ price: 120, billingCycle: 'yearly', status: 'active' }), 10);
  assert.equal(calculateMonthlyCost({ price: 50, billingCycle: 'monthly', status: 'active' }), 50);
});

test('calculateMonthlyCost ignores paused and cancelled subscriptions', () => {
  assert.equal(calculateMonthlyCost({ price: 50, billingCycle: 'monthly', status: 'paused' }), 0);
  assert.equal(calculateMonthlyCost({ price: 50, billingCycle: 'monthly', status: 'cancelled' }), 0);
});

test('calculateYearlyCost returns annualized active subscription cost', () => {
  assert.equal(calculateYearlyCost({ price: 20, billingCycle: 'monthly', status: 'active' }), 240);
});

test('daysUntil calculates date distance using calendar days', () => {
  const now = new Date('2026-05-19T10:00:00Z');
  assert.equal(daysUntil('2026-05-20', now), 1);
  assert.equal(daysUntil('2026-05-18', now), -1);
});

test('getRenewalStatus identifies due soon and overdue subscriptions', () => {
  const now = new Date('2026-05-19T10:00:00Z');
  assert.equal(getRenewalStatus({ status: 'active', nextPaymentDate: '2026-05-23' }, now), 'due-soon');
  assert.equal(getRenewalStatus({ status: 'active', nextPaymentDate: '2026-06-20' }, now), 'upcoming');
  assert.equal(getRenewalStatus({ status: 'active', nextPaymentDate: '2026-05-18' }, now), 'overdue');
  assert.equal(getRenewalStatus({ status: 'paused', nextPaymentDate: '2026-05-20' }, now), 'inactive');
});

test('calculateBudgetSummary returns totals, budget status, and category totals', () => {
  const now = new Date('2026-05-19T10:00:00Z');
  const summary = calculateBudgetSummary(
    [
      {
        id: 1,
        name: 'Spotify',
        category: 'Music',
        price: 60,
        billingCycle: 'monthly',
        status: 'active',
        nextPaymentDate: '2026-05-21'
      },
      {
        id: 2,
        name: 'Cloud Storage',
        category: 'Productivity',
        price: 120,
        billingCycle: 'yearly',
        status: 'active',
        nextPaymentDate: '2026-06-10'
      },
      {
        id: 3,
        name: 'Cancelled App',
        category: 'Productivity',
        price: 40,
        billingCycle: 'monthly',
        status: 'cancelled',
        nextPaymentDate: '2026-05-22'
      }
    ],
    50,
    now
  );

  assert.equal(summary.monthlyTotal, 70);
  assert.equal(summary.yearlyTotal, 840);
  assert.equal(summary.isBudgetExceeded, true);
  assert.equal(summary.activeCount, 2);
  assert.equal(summary.totalCount, 3);
  assert.equal(summary.upcomingPayments.length, 1);
  assert.deepEqual(summary.categoryTotals, {
    Music: 60,
    Productivity: 10
  });
});
