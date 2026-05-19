const jwt = require('jsonwebtoken');
const env = require('../config/env');
const userRepository = require('../repositories/userRepository');
const httpError = require('../utils/httpError');

function requireAuth(req, _res, next) {
  const header = req.headers.authorization || '';
  const [type, token] = header.split(' ');

  if (type !== 'Bearer' || !token) {
    return next(httpError(401, 'A valid Bearer token is required.'));
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const user = userRepository.findUserById(payload.sub);

    if (!user) {
      return next(httpError(401, 'User for this token no longer exists.'));
    }

    req.user = user;
    next();
  } catch (_error) {
    next(httpError(401, 'Token is invalid or expired.'));
  }
}

module.exports = {
  requireAuth
};
