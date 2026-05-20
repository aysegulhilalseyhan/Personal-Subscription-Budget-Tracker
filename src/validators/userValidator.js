function validateBudgetInput(input) {
  const errors = [];
  const monthlyBudgetLimit = Number(input.monthlyBudgetLimit);

  if (!Number.isFinite(monthlyBudgetLimit) || monthlyBudgetLimit < 0) {
    errors.push('Monthly budget limit must be zero or a positive number.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: { monthlyBudgetLimit }
  };
}

module.exports = {
  validateBudgetInput
};
