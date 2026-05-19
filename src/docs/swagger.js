const swaggerJsdoc = require('swagger-jsdoc');

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Personal Subscription Budget Tracker API',
      version: '1.0.0',
      description:
        'REST API for managing user-specific recurring subscriptions, budgets, and upcoming renewals.'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'Aysegul Hilal Seyhan' },
            email: { type: 'string', example: 'aysegul@example.com' },
            password: { type: 'string', example: 'secret123' },
            monthlyBudgetLimit: { type: 'number', example: 800 }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'aysegul@example.com' },
            password: { type: 'string', example: 'secret123' }
          }
        },
        SubscriptionInput: {
          type: 'object',
          required: ['name', 'category', 'price', 'billingCycle', 'nextPaymentDate', 'status'],
          properties: {
            name: { type: 'string', example: 'Spotify Premium' },
            category: { type: 'string', example: 'Entertainment' },
            price: { type: 'number', example: 59.99 },
            billingCycle: {
              type: 'string',
              enum: ['weekly', 'monthly', 'yearly'],
              example: 'monthly'
            },
            nextPaymentDate: {
              type: 'string',
              format: 'date',
              example: '2026-06-01'
            },
            status: {
              type: 'string',
              enum: ['active', 'paused', 'cancelled'],
              example: 'active'
            },
            paymentMethod: { type: 'string', example: 'Credit Card' },
            notes: { type: 'string', example: 'Family plan' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
});

module.exports = swaggerSpec;
