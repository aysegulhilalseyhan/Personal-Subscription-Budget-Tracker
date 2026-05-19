const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const env = require('../config/env');

let db;

function getDb() {
  if (!db) {
    const dbDir = path.dirname(env.dbFile);
    fs.mkdirSync(dbDir, { recursive: true });
    db = new Database(env.dbFile);
    db.pragma('foreign_keys = ON');
    migrate(db);
  }

  return db;
}

function migrate(database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      monthly_budget_limit REAL NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('weekly', 'monthly', 'yearly')),
      next_payment_date TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('active', 'paused', 'cancelled')),
      payment_method TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id
      ON subscriptions(user_id);

    CREATE INDEX IF NOT EXISTS idx_subscriptions_user_next_payment
      ON subscriptions(user_id, next_payment_date);
  `);
}

function closeDb() {
  if (db) {
    db.close();
    db = undefined;
  }
}

module.exports = {
  getDb,
  closeDb
};
