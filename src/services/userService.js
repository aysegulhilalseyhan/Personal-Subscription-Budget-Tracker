const userRepository = require('../repositories/userRepository');

function updateBudget(userId, monthlyBudgetLimit) {
  return userRepository.updateMonthlyBudgetLimit(userId, monthlyBudgetLimit);
}

module.exports = {
  updateBudget
};
