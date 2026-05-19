const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const userRepository = require('../repositories/userRepository');
const httpError = require('../utils/httpError');

async function register({ name, email, password, monthlyBudgetLimit }) {
  const existingUser = userRepository.findUserByEmail(email);

  if (existingUser) {
    throw httpError(409, 'An account with this email already exists.');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = userRepository.createUser({ name, email, passwordHash, monthlyBudgetLimit });
  const token = createToken(user);

  return { user, token };
}

async function login({ email, password }) {
  const userRecord = userRepository.findUserByEmail(email);

  if (!userRecord) {
    throw httpError(401, 'Invalid email or password.');
  }

  const isPasswordValid = await bcrypt.compare(password, userRecord.password_hash);

  if (!isPasswordValid) {
    throw httpError(401, 'Invalid email or password.');
  }

  const user = userRepository.findUserById(userRecord.id);
  const token = createToken(user);

  return { user, token };
}

function createToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email
    },
    env.jwtSecret,
    { expiresIn: '2h' }
  );
}

module.exports = {
  register,
  login,
  createToken
};
