const { getDb } = require('../db/database');

function createUser({ name, email, passwordHash, monthlyBudgetLimit = 0 }) {
  const result = getDb()
    .prepare(`
      INSERT INTO users (name, email, password_hash, monthly_budget_limit)
      VALUES (?, ?, ?, ?)
    `)
    .run(name.trim(), email.trim().toLowerCase(), passwordHash, monthlyBudgetLimit);

  return findUserById(result.lastInsertRowid);
}

function findUserByEmail(email) {
  return getDb()
    .prepare('SELECT * FROM users WHERE email = ?')
    .get(email.trim().toLowerCase());
}

function findUserById(id) {
  return getDb()
    .prepare(`
      SELECT id, name, email, monthly_budget_limit AS monthlyBudgetLimit, created_at AS createdAt
      FROM users
      WHERE id = ?
    `)
    .get(id);
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById
};
