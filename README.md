# SplitEase 💸

A full-stack bill splitting web app built with the MERN stack. Split expenses with friends, track balances, and settle debts — without the awkward maths.

## 🌐 Live Demo
**Frontend:** https://split-ease-by-vidhi.vercel.app  

> Backend is on Render free tier — may take 30-50 seconds on first request.

## ✨ Features

- **Auth** — Register, login, JWT-based session, profile & password management
- **Groups** — Create expense groups, invite friends, track group balances
- **Expenses** — Add, view, delete expenses with equal split logic
- **Balance Calculation** — Auto-calculates who owes whom across all shared groups
- **Debt Simplification** — Greedy algorithm minimizes number of transactions to settle
- **Friends System** — Send/accept/decline friend requests, view net balance per friend
- **Expense Detail** — View full breakdown of any expense
- **Search & Filter** — Filter expenses by type, sort by date or amount
- **Mobile Responsive** — Bottom nav on mobile, sidebar on desktop
- **Toast Notifications** — Non-blocking feedback on all actions

## 🛠 Tech Stack

**Frontend**
- React 18 + Vite
- Tailwind CSS v4
- React Router v6
- Axios + interceptors
- React Icons + react-hot-toast

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT + bcryptjs
- express-validator

**Deployment**
- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

## 📁 Project Structure

```
bill-splitter/
├── client/          # React frontend
│   ├── src/
│   │   ├── api/         # Axios instance
│   │   ├── components/  # Reusable components
│   │   ├── context/     # AuthContext
│   │   ├── hooks/       # Custom hooks
│   │   ├── pages/       # Route pages
│   │   └── utils/       # Helpers
│   └── vercel.json
│
└── server/          # Express backend
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── utils/
    └── server.js
```

## 🚀 Run Locally

**Backend:**

create .env with PORT, MONGO_URI, JWT_SECRET, CLIENT_URL
```bash
cd server
npm install
npm run dev
```

**Frontend:**

create .env with VITE_API_URL=http://localhost:5000/api
```bash
cd client
npm install
npm run dev
```

## 👩‍💻 Built By
**Vidhi Sonani** — [GitHub](https://github.com/vidhisonani) · [Portfolio](https://vidhipatel-portfolio.vercel.app/)