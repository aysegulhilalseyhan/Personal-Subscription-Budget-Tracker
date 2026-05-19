function calculateMonthlyCost(subscription) {
  if (subscription.status && subscription.status !== 'active') {
    return 0;
  }

  const price = Number(subscription.price);

  if (subscription.billingCycle === 'weekly') {
    return roundMoney(price * 4.345);
  }

  if (subscription.billingCycle === 'yearly') {
    return roundMoney(price / 12);
  }

  return roundMoney(price);
}

function calculateYearlyCost(subscription) {
  return roundMoney(calculateMonthlyCost(subscription) * 12);
}

function daysUntil(dateString, now = new Date()) {
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const target = new Date(`${dateString}T00:00:00Z`);
  const msPerDay = 1000 * 60 * 60 * 24;

  return Math.ceil((target - today) / msPerDay);
}

function getRenewalStatus(subscription, now = new Date()) {
  if (subscription.status !== 'active') {
    return 'inactive';
  }

  const days = daysUntil(subscription.nextPaymentDate, now);

  if (days < 0) return 'overdue';
  if (days <= 7) return 'due-soon';
  return 'upcoming';
}

function calculateBudgetSummary(subscriptions, monthlyBudgetLimit = 0, now = new Date()) {
  const activeSubscriptions = subscriptions.filter((item) => item.status === 'active');
  const monthlyTotal = activeSubscriptions.reduce((sum, item) => sum + calculateMonthlyCost(item), 0);
  const yearlyTotal = activeSubscriptions.reduce((sum, item) => sum + calculateYearlyCost(item), 0);
  const upcomingPayments = activeSubscriptions
    .map((item) => ({
      ...item,
      daysUntilPayment: daysUntil(item.nextPaymentDate, now),
      renewalStatus: getRenewalStatus(item, now)
    }))
    .filter((item) => item.daysUntilPayment >= 0 && item.daysUntilPayment <= 7)
    .sort((a, b) => a.daysUntilPayment - b.daysUntilPayment);

  const categoryTotals = activeSubscriptions.reduce((totals, item) => {
    const key = item.category;
    totals[key] = (totals[key] || 0) + calculateMonthlyCost(item);
    return totals;
  }, {});

  return {
    monthlyTotal: roundMoney(monthlyTotal),
    yearlyTotal: roundMoney(yearlyTotal),
    monthlyBudgetLimit: roundMoney(monthlyBudgetLimit),
    budgetRemaining: roundMoney(monthlyBudgetLimit - monthlyTotal),
    isBudgetExceeded: monthlyBudgetLimit > 0 && monthlyTotal > monthlyBudgetLimit,
    activeCount: activeSubscriptions.length,
    totalCount: subscriptions.length,
    upcomingPayments,
    categoryTotals: Object.fromEntries(
      Object.entries(categoryTotals).map(([category, amount]) => [category, roundMoney(amount)])
    )
  };
}

function roundMoney(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

module.exports = {
  calculateMonthlyCost,
  calculateYearlyCost,
  daysUntil,
  getRenewalStatus,
  calculateBudgetSummary,
  roundMoney
};
