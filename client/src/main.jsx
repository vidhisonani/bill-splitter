import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#1e1b4b",
            padding: "12px 16px",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(99, 102, 241, 0.15)",
            border: "1px solid #e0e7ff",
            fontSize: "14px",
            fontWeight: 500,
          },
          success: {
            iconTheme: {
              primary: "#6366f1",
              secondary: "#eef2ff",
            },
            style: {
              border: "1px solid #c7d2fe",
              background: "#eef2ff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fef2f2",
            },
            style: {
              border: "1px solid #fecaca",
              background: "#fef2f2",
            },
          },
        }}
      />
      <App />
      <Analytics />
    </AuthProvider>
  </StrictMode>
);
