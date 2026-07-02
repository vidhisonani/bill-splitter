# SplitEase — Backend

Express + MongoDB REST API for the SplitEase bill splitting app.

## Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Setup

1. Install dependencies:
  npm install

2. Create a `.env` file:
   ```bash
   PORT=5000
   MONGO_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_secret_key
   ```

3. Run in development:
   npm run dev

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login | No |
| GET | /api/auth/me | Get logged-in user | Yes |

### Groups
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/groups | Create group | Yes |
| GET | /api/groups | Get my groups | Yes |
| GET | /api/groups/:id | Get group by ID | Yes |
| POST | /api/groups/:id/members | Add member | Yes |

### Expenses
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/groups/:id/expenses | Add expense | Yes |
| GET | /api/groups/:id/expenses | Get group expenses | Yes |
| DELETE | /api/expenses/:id | Delete expense | Yes |

### Settlements
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/groups/:id/settle | Settle a debt | Yes |

## Folder Structure
```
server/
├── config/         # DB connection
├── controllers/    # Route logic
├── middleware/     # Auth middleware
├── models/         # Mongoose schemas
├── routes/         # Express routers
├── utils/          # Token generator
└── server.js       # Entry point
```