const authService = require('../services/authService');
const { validateRegisterInput, validateLoginInput } = require('../validators/authValidator');
const httpError = require('../utils/httpError');

async function register(req, res, next) {
  try {
    const validation = validateRegisterInput(req.body);

    if (!validation.isValid) {
      throw httpError(400, 'Registration input is invalid.', validation.errors);
    }

    const result = await authService.register(validation.value);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const validation = validateLoginInput(req.body);

    if (!validation.isValid) {
      throw httpError(400, 'Login input is invalid.', validation.errors);
    }

    const result = await authService.login(validation.value);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

function me(req, res) {
  res.status(200).json({ user: req.user });
}

module.exports = {
  register,
  login,
  me
};
