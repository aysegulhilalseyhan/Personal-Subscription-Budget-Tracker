const userService = require('../services/userService');
const { validateBudgetInput } = require('../validators/userValidator');
const httpError = require('../utils/httpError');

function updateBudget(req, res, next) {
  try {
    const validation = validateBudgetInput(req.body);

    if (!validation.isValid) {
      throw httpError(400, 'Budget input is invalid.', validation.errors);
    }

    const user = userService.updateBudget(req.user.id, validation.value.monthlyBudgetLimit);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  updateBudget
};
