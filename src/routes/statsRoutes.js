const express = require('express');
const subscriptionController = require('../controllers/subscriptionController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @openapi
 * /api/stats:
 *   get:
 *     summary: Get budget summary for the authenticated user
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User-specific budget statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StatsResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/', requireAuth, subscriptionController.getStats);

module.exports = router;
