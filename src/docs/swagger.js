const swaggerJsdoc = require('swagger-jsdoc');

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Personal Subscription Budget Tracker API',
      version: '1.0.0',
      description:
        'REST API for managing user-specific recurring subscriptions, budgets, and upcoming renewals. Use the Auth endpoints to get a JWT, then click Authorize and enter the token as a Bearer token.'
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
      responses: {
        BadRequest: {
          description: 'Invalid request input',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: {
                message: 'Subscription input is invalid.',
                details: ['Price must be greater than zero.']
              }
            }
          }
        },
        Unauthorized: {
          description: 'JWT token is missing, invalid, or expired',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: {
                message: 'A valid Bearer token is required.'
              }
            }
          }
        },
        NotFound: {
          description: 'Requested resource was not found for the authenticated user',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: {
                message: 'Subscription was not found.'
              }
            }
          }
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Aysegul Hilal Seyhan' },
            email: { type: 'string', example: 'aysegul@example.com' },
            monthlyBudgetLimit: { type: 'number', example: 800 },
            createdAt: { type: 'string', example: '2026-05-20 10:00:00' }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/User' },
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Request failed.' },
            details: {
              type: 'array',
              items: { type: 'string' },
              example: ['Email is required.']
            }
          }
        },
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
        BudgetUpdateRequest: {
          type: 'object',
          required: ['monthlyBudgetLimit'],
          properties: {
            monthlyBudgetLimit: { type: 'number', minimum: 0, example: 950 }
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
        },
        Subscription: {
          allOf: [
            { $ref: '#/components/schemas/SubscriptionInput' },
            {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                userId: { type: 'integer', example: 1 },
                createdAt: { type: 'string', example: '2026-05-20 10:00:00' },
                updatedAt: { type: 'string', example: '2026-05-20 10:00:00' }
              }
            }
          ]
        },
        SubscriptionListResponse: {
          type: 'object',
          properties: {
            subscriptions: {
              type: 'array',
              items: { $ref: '#/components/schemas/Subscription' }
            }
          }
        },
        SubscriptionResponse: {
          type: 'object',
          properties: {
            subscription: { $ref: '#/components/schemas/Subscription' }
          }
        },
        StatsResponse: {
          type: 'object',
          properties: {
            stats: {
              type: 'object',
              properties: {
                monthlyTotal: { type: 'number', example: 259.98 },
                yearlyTotal: { type: 'number', example: 3119.76 },
                monthlyBudgetLimit: { type: 'number', example: 800 },
                budgetRemaining: { type: 'number', example: 540.02 },
                isBudgetExceeded: { type: 'boolean', example: false },
                activeCount: { type: 'integer', example: 3 },
                totalCount: { type: 'integer', example: 4 },
                upcomingPayments: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Subscription' }
                },
                categoryTotals: {
                  type: 'object',
                  additionalProperties: { type: 'number' },
                  example: {
                    Entertainment: 149.99,
                    Productivity: 109.99
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
});

module.exports = swaggerSpec;
