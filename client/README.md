# SplitEase — Frontend

React + Vite frontend for the SplitEase bill splitting app.

## Live Demo
🌐 https://split-ease-by-vidhi.vercel.app

## Tech Stack
- React 18 + Vite
- Tailwind CSS v4
- React Router v6
- Axios
- React Icons (Heroicons hi2, Material Design icons md)
- react-hot-toast

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file:
    ```bash
   VITE_API_URL=http://localhost:5000/api
   ```

3. Run in development:
   ```bash
   npm run dev
   ```

## Pages

| Route | Page | Protected |
|-------|------|-----------|
| / | Home (Landing) | No |
| /login | Login | No |
| /register | Register | No |
| /dashboard | Dashboard | Yes |
| /groups | All Groups | Yes |
| /groups/:id | Group Detail | Yes |
| /expenses | All Expenses | Yes |
| /friends | All Friends | Yes |
| /settings | Settings | Yes |
| * | 404 Not Found | No |

## Folder Structure
```
client/src/
├── api/            # Axios instance + interceptor
├── components/     # ProtectedRoute, reusable UI
├── context/        # AuthContext (JWT + localStorage)
├── pages/          # One file per route
├── hooks/          # Custom hooks (useGroups, useDocumentTitle)
├── utils/          # avatar.js utility
└── App.jsx         # Router setup
```

## Key Concepts Used
- JWT auth with localStorage persistence
- Axios interceptor auto-attaches token to every request
- Automatic 401 logout handling in api.js
- React Context for global auth state
- Protected routes redirect to /login if no token
- Custom hooks for data fetching separation
- Greedy debt simplification algorithm for settlement plan
- Mobile responsive with bottom nav + desktop sidebar