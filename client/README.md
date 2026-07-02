# SplitEase — Frontend

React + Vite frontend for the SplitEase bill splitting app.

## Tech Stack
- React 18 + Vite
- Tailwind CSS v4
- React Router v6
- Axios
- React Icons (Heroicons hi2)

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file:
    ```
   VITE_API_URL=http://localhost:5000/api
   ````

3. Run in development:
   ```
   npm run dev
   ```

## Pages

| Route | Page | Protected |
|-------|------|-----------|
| /login | Login | No |
| /register | Register | No |
| /dashboard | Dashboard | Yes |
| /groups/:id | Group Detail | Yes |
| /groups | All Groups | Yes |

## Folder Structure
```
client/src/
├── api/            # Axios instance + interceptor
├── components/     # ProtectedRoute, reusable UI
├── context/        # AuthContext (JWT + localStorage)
├── pages/          # One file per route
└── App.jsx         # Router setup
```
## Key Concepts Used
- JWT auth with localStorage persistence
- Axios interceptor auto-attaches token to every request
- React Context for global auth state
- Protected routes redirect to /login if no token
- useParams() for dynamic route IDs
- useEffect() for data fetching on mount