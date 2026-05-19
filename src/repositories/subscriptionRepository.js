const { getDb } = require('../db/database');

function mapSubscription(row) {
  if (!row) return undefined;

  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    category: row.category,
    price: row.price,
    billingCycle: row.billing_cycle,
    nextPaymentDate: row.next_payment_date,
    status: row.status,
    paymentMethod: row.payment_method || '',
    notes: row.notes || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function createSubscription(userId, subscription) {
  const result = getDb()
    .prepare(`
      INSERT INTO subscriptions (
        user_id, name, category, price, billing_cycle, next_payment_date,
        status, payment_method, notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      userId,
      subscription.name.trim(),
      subscription.category.trim(),
      Number(subscription.price),
      subscription.billingCycle,
      subscription.nextPaymentDate,
      subscription.status,
      subscription.paymentMethod?.trim() || null,
      subscription.notes?.trim() || null
    );

  return findSubscriptionById(userId, result.lastInsertRowid);
}

function listSubscriptions(userId, filters = {}) {
  const conditions = ['user_id = ?'];
  const params = [userId];

  if (filters.search) {
    conditions.push('(LOWER(name) LIKE ? OR LOWER(category) LIKE ?)');
    const term = `%${filters.search.trim().toLowerCase()}%`;
    params.push(term, term);
  }

  if (filters.category) {
    conditions.push('LOWER(category) = ?');
    params.push(filters.category.trim().toLowerCase());
  }

  if (filters.status) {
    conditions.push('status = ?');
    params.push(filters.status);
  }

  const rows = getDb()
    .prepare(`
      SELECT *
      FROM subscriptions
      WHERE ${conditions.join(' AND ')}
      ORDER BY date(next_payment_date) ASC, name ASC
    `)
    .all(...params);

  return rows.map(mapSubscription);
}

function findSubscriptionById(userId, id) {
  const row = getDb()
    .prepare('SELECT * FROM subscriptions WHERE user_id = ? AND id = ?')
    .get(userId, id);

  return mapSubscription(row);
}

function updateSubscription(userId, id, subscription) {
  const result = getDb()
    .prepare(`
      UPDATE subscriptions
      SET
        name = ?,
        category = ?,
        price = ?,
        billing_cycle = ?,
        next_payment_date = ?,
        status = ?,
        payment_method = ?,
        notes = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND id = ?
    `)
    .run(
      subscription.name.trim(),
      subscription.category.trim(),
      Number(subscription.price),
      subscription.billingCycle,
      subscription.nextPaymentDate,
      subscription.status,
      subscription.paymentMethod?.trim() || null,
      subscription.notes?.trim() || null,
      userId,
      id
    );

  if (result.changes === 0) return undefined;

  return findSubscriptionById(userId, id);
}

function deleteSubscription(userId, id) {
  const result = getDb()
    .prepare('DELETE FROM subscriptions WHERE user_id = ? AND id = ?')
    .run(userId, id);

  return result.changes > 0;
}

module.exports = {
  createSubscription,
  listSubscriptions,
  findSubscriptionById,
  updateSubscription,
  deleteSubscription
};
