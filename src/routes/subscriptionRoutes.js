const express = require('express');
const subscriptionController = require('../controllers/subscriptionController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(requireAuth);

/**
 * @openapi
 * /api/subscriptions:
 *   get:
 *     summary: List authenticated user's subscriptions
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, paused, cancelled]
 *     responses:
 *       200:
 *         description: User-specific subscription list
 */
router.get('/', subscriptionController.listSubscriptions);

/**
 * @openapi
 * /api/subscriptions:
 *   post:
 *     summary: Create a subscription for the authenticated user
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubscriptionInput'
 *     responses:
 *       201:
 *         description: Subscription created
 *       400:
 *         description: Invalid input
 */
router.post('/', subscriptionController.createSubscription);

/**
 * @openapi
 * /api/subscriptions/{id}:
 *   get:
 *     summary: Get one authenticated user's subscription
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Subscription found
 *       404:
 *         description: Subscription not found for this user
 */
router.get('/:id', subscriptionController.getSubscription);

/**
 * @openapi
 * /api/subscriptions/{id}:
 *   put:
 *     summary: Update one authenticated user's subscription
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubscriptionInput'
 *     responses:
 *       200:
 *         description: Subscription updated
 *       404:
 *         description: Subscription not found for this user
 */
router.put('/:id', subscriptionController.updateSubscription);

/**
 * @openapi
 * /api/subscriptions/{id}:
 *   delete:
 *     summary: Delete one authenticated user's subscription
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Subscription deleted
 *       404:
 *         description: Subscription not found for this user
 */
router.delete('/:id', subscriptionController.deleteSubscription);

module.exports = router;
