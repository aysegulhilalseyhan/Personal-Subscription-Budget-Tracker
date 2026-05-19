const subscriptionRepository = require('../repositories/subscriptionRepository');
const { calculateBudgetSummary } = require('./budgetService');
const httpError = require('../utils/httpError');

function create(userId, subscription) {
  return subscriptionRepository.createSubscription(userId, subscription);
}

function list(userId, filters) {
  return subscriptionRepository.listSubscriptions(userId, filters);
}

function getById(userId, id) {
  const subscription = subscriptionRepository.findSubscriptionById(userId, id);

  if (!subscription) {
    throw httpError(404, 'Subscription was not found.');
  }

  return subscription;
}

function update(userId, id, subscription) {
  const updated = subscriptionRepository.updateSubscription(userId, id, subscription);

  if (!updated) {
    throw httpError(404, 'Subscription was not found.');
  }

  return updated;
}

function remove(userId, id) {
  const deleted = subscriptionRepository.deleteSubscription(userId, id);

  if (!deleted) {
    throw httpError(404, 'Subscription was not found.');
  }
}

function getStats(user) {
  const subscriptions = subscriptionRepository.listSubscriptions(user.id);
  return calculateBudgetSummary(subscriptions, user.monthlyBudgetLimit);
}

module.exports = {
  create,
  list,
  getById,
  update,
  remove,
  getStats
};
