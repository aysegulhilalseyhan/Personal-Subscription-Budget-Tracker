const path = require('path');

const env = {
  port: Number(process.env.PORT || 3000),
  host: process.env.HOST || '127.0.0.1',
  jwtSecret: process.env.JWT_SECRET || 'development-secret-change-me',
  dbFile: process.env.DB_FILE || path.join(process.cwd(), 'data', 'subscriptions.db')
};

module.exports = env;
