# Personal Subscription Budget Tracker

Personal Subscription Budget Tracker is a web-based CRUD application for managing recurring subscriptions with user-specific budgeting and renewal tracking. It was developed for the System Analysis and Design course project requirements.

## Project Purpose

Many people pay for several recurring services such as music, cloud storage, streaming, education platforms, and productivity tools. These payments are easy to forget because they renew at different times and with different billing cycles. This system helps users manage their own subscriptions, calculate monthly and yearly costs, monitor upcoming renewals, and compare spending against a personal monthly budget limit.

## Main Features

- User registration and login with JWT authentication
- User-specific data isolation
- Full CRUD operations for subscriptions
- Search subscriptions by name or category
- Filter subscriptions by category and status
- Monthly and yearly cost calculation
- Upcoming payment tracking for the next 7 days
- Category-based monthly spending summary
- Budget limit comparison and budget-exceeded warning
- Interactive Swagger/OpenAPI documentation
- Unit tests for business logic and validation functions

## Technical Stack

- Frontend: HTML, CSS, Vanilla JavaScript
- Backend: Node.js, Express.js
- Database: SQLite
- Authentication: JWT
- Password security: bcryptjs
- API documentation: Swagger UI
- Testing: Node.js built-in test runner

## Requirement Mapping

| Requirement | Implementation |
| --- | --- |
| RESTful API | Express routes under `/api` |
| CRUD operations | Create, read, update, delete subscriptions |
| Vanilla JavaScript SPA | Dashboard uses `fetch` without full page reloads |
| Database | SQLite database stored in `data/subscriptions.db` |
| JWT authentication | Register/login endpoints issue JWT tokens |
| Data isolation | Every subscription has `user_id`; API queries always filter by authenticated user |
| Validation | Frontend form validation and backend validators |
| Business logic outside routes | Cost, renewal, budget, and validation logic are in service/validator files |
| Unit testing | Tests cover budget calculations and validation |
| Swagger | `/api-docs` |
| Documentation | This README explains setup, usage, and API behavior |

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create an environment file:

```bash
cp .env.example .env
```

3. Start the application:

```bash
npm start
```

4. Open the application:

```txt
http://localhost:3000/auth.html
```

5. Open Swagger API documentation:

```txt
http://localhost:3000/api-docs
```

## Optional Demo Data

To create two sample users and sample subscriptions:

```bash
npm run seed
```

Demo accounts:

```txt
user1@example.com / password123
user2@example.com / password123
```

These accounts are intentionally separate. When logged in as `user1`, only user1's subscriptions are visible. When logged in as `user2`, only user2's subscriptions are visible.

## API Overview

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Create a user account |
| POST | `/api/auth/login` | Login and receive a JWT |
| GET | `/api/auth/me` | Get authenticated user profile |

### Subscriptions

All subscription endpoints require:

```txt
Authorization: Bearer <JWT_TOKEN>
```

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/subscriptions` | List authenticated user's subscriptions |
| GET | `/api/subscriptions/:id` | Get one subscription |
| POST | `/api/subscriptions` | Create subscription |
| PUT | `/api/subscriptions/:id` | Update subscription |
| DELETE | `/api/subscriptions/:id` | Delete subscription |
| GET | `/api/stats` | Get authenticated user's budget statistics |

Query filters:

```txt
GET /api/subscriptions?search=spotify
GET /api/subscriptions?category=Entertainment
GET /api/subscriptions?status=active
```

## Subscription Data Model

| Field | Description |
| --- | --- |
| `name` | Subscription name |
| `category` | Spending category |
| `price` | Payment amount |
| `billingCycle` | `weekly`, `monthly`, or `yearly` |
| `nextPaymentDate` | Next renewal date in `YYYY-MM-DD` format |
| `status` | `active`, `paused`, or `cancelled` |
| `paymentMethod` | Optional payment method |
| `notes` | Optional user notes |

## Testing

Run unit tests:

```bash
npm test
```

The tests focus on business logic instead of route testing, as required:

- Monthly cost conversion
- Yearly cost calculation
- Upcoming payment detection
- Renewal status calculation
- Budget summary generation
- Subscription input validation

## Data Isolation Explanation

The project stores each subscription with a `user_id`. The authenticated user's ID comes from the JWT token. Subscription queries use both the subscription ID and the authenticated user's ID, for example:

```sql
SELECT * FROM subscriptions WHERE user_id = ? AND id = ?
```

This prevents one user from viewing, updating, or deleting another user's records.
