const bcrypt = require('bcryptjs');
const { getDb, closeDb } = require('../src/db/database');

const db = getDb();

const users = [
  {
    name: 'Demo User One',
    email: 'user1@example.com',
    password: 'password123',
    monthlyBudgetLimit: 750,
    subscriptions: [
      {
        name: 'Spotify Premium',
        category: 'Entertainment',
        price: 59.99,
        billingCycle: 'monthly',
        nextPaymentDate: '2026-05-24',
        status: 'active',
        paymentMethod: 'Credit Card',
        notes: 'Individual plan'
      },
      {
        name: 'iCloud Storage',
        category: 'Productivity',
        price: 39.99,
        billingCycle: 'monthly',
        nextPaymentDate: '2026-05-28',
        status: 'active',
        paymentMethod: 'Debit Card',
        notes: 'Storage for photos and documents'
      },
      {
        name: 'Online Course Platform',
        category: 'Education',
        price: 1200,
        billingCycle: 'yearly',
        nextPaymentDate: '2026-08-10',
        status: 'active',
        paymentMethod: 'Credit Card',
        notes: 'Annual learning subscription'
      }
    ]
  },
  {
    name: 'Demo User Two',
    email: 'user2@example.com',
    password: 'password123',
    monthlyBudgetLimit: 300,
    subscriptions: [
      {
        name: 'Video Streaming',
        category: 'Entertainment',
        price: 149.99,
        billingCycle: 'monthly',
        nextPaymentDate: '2026-05-22',
        status: 'active',
        paymentMethod: 'Credit Card',
        notes: 'Only visible to user2'
      }
    ]
  }
];

for (const user of users) {
  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(user.email);
  const userId =
    existingUser?.id ||
    db
      .prepare(`
        INSERT INTO users (name, email, password_hash, monthly_budget_limit)
        VALUES (?, ?, ?, ?)
      `)
      .run(user.name, user.email, bcrypt.hashSync(user.password, 10), user.monthlyBudgetLimit).lastInsertRowid;

  for (const subscription of user.subscriptions) {
    const exists = db
      .prepare('SELECT id FROM subscriptions WHERE user_id = ? AND name = ?')
      .get(userId, subscription.name);

    if (!exists) {
      db
        .prepare(`
          INSERT INTO subscriptions (
            user_id, name, category, price, billing_cycle, next_payment_date,
            status, payment_method, notes
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .run(
          userId,
          subscription.name,
          subscription.category,
          subscription.price,
          subscription.billingCycle,
          subscription.nextPaymentDate,
          subscription.status,
          subscription.paymentMethod,
          subscription.notes
        );
    }
  }
}

closeDb();

console.log('Seed data created.');
console.log('user1@example.com / password123');
console.log('user2@example.com / password123');
