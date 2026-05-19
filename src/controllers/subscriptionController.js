const subscriptionService = require('../services/subscriptionService');
const {
  validateSubscriptionInput,
  validateSubscriptionFilters
} = require('../validators/subscriptionValidator');
const httpError = require('../utils/httpError');

function listSubscriptions(req, res, next) {
  try {
    const validation = validateSubscriptionFilters(req.query);

    if (!validation.isValid) {
      throw httpError(400, 'Filter input is invalid.', validation.errors);
    }

    const subscriptions = subscriptionService.list(req.user.id, validation.value);
    res.status(200).json({ subscriptions });
  } catch (error) {
    next(error);
  }
}

function getSubscription(req, res, next) {
  try {
    const subscription = subscriptionService.getById(req.user.id, Number(req.params.id));
    res.status(200).json({ subscription });
  } catch (error) {
    next(error);
  }
}

function createSubscription(req, res, next) {
  try {
    const validation = validateSubscriptionInput(req.body);

    if (!validation.isValid) {
      throw httpError(400, 'Subscription input is invalid.', validation.errors);
    }

    const subscription = subscriptionService.create(req.user.id, validation.value);
    res.status(201).json({ subscription });
  } catch (error) {
    next(error);
  }
}

function updateSubscription(req, res, next) {
  try {
    const validation = validateSubscriptionInput(req.body);

    if (!validation.isValid) {
      throw httpError(400, 'Subscription input is invalid.', validation.errors);
    }

    const subscription = subscriptionService.update(req.user.id, Number(req.params.id), validation.value);
    res.status(200).json({ subscription });
  } catch (error) {
    next(error);
  }
}

function deleteSubscription(req, res, next) {
  try {
    subscriptionService.remove(req.user.id, Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

function getStats(req, res, next) {
  try {
    const stats = subscriptionService.getStats(req.user);
    res.status(200).json({ stats });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listSubscriptions,
  getSubscription,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getStats
};
