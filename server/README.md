# SplitEase — Backend

Express + MongoDB REST API for the SplitEase bill splitting app.

## Live API
🔗 https://bill-splitter-al6g.onrender.com

> Note: Hosted on Render free tier — may take 30-50 seconds to wake up on first request.


## Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing
- express-validator for input validation

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```bash
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

3. Run in development:
```bash
npm run dev
```

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login | No |
| GET | /api/auth/me | Get logged-in user | Yes |
| PUT | /api/auth/profile | Update profile | Yes |
| PUT | /api/auth/password | Change password | Yes |

### Groups
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/groups | Create group | Yes |
| GET | /api/groups | Get my groups | Yes |
| GET | /api/groups/:id | Get group by ID | Yes |
| POST | /api/groups/:id/members | Add member (friends only) | Yes |
| DELETE | /api/groups/:id | Delete group (creator only) | Yes |

### Expenses
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/groups/:id/expenses | Add expense | Yes |
| GET | /api/groups/:id/expenses | Get group expenses | Yes |
| GET | /api/groups/:id/expenses | Get all expenses | Yes |
| DELETE | /api/expenses/:id | Delete expense (creator only) | Yes |

### Friends
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/friends/request | Send friend request | Yes |
| GET | /api/friends/requests | Get incoming requests | Yes |
| GET | /api/friends/requests/sent | Get sent requests | Yes |
| PUT | /api/friends/requests/:id | Accept or reject request | Yes |
| DELETE | /api/friends/requests/:id | Cancel sent request | Yes |
| GET | /api/friends | Get all friends | Yes |
| GET | /api/friends/balances | Get friends with net balances | Yes |

<!-- ### Settlements
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/groups/:id/settle | Settle a debt | Yes | -->

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