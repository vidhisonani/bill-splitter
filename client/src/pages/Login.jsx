import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MdEmail,
  MdLock,
  MdLogin,
  MdReceiptLong,
  MdError,
} from "react-icons/md";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import { validateEmail, validatePassword } from "../utils/validation";

function Login() {
  useDocumentTitle("Login | SplitEase");

  const { login, token } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const NewEye = showPassword ? HiEyeSlash : HiEye;

  // directly dashboard if logged in
  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    if (serverError) setServerError("");
  };

  const validateField = (name, value) => {
    let error = "";
    if (name === "email") error = validateEmail(value);
    if (name === "password") error = validatePassword(value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    if(emailError || passwordError) return;
    setLoading(true);

    try {
      const response = await api.post("/auth/login", formData);
      login(response.data);
    } catch (err) {
      if (err.response?.data?.errors) {
        setServerError(err.response?.data?.errors[0]?.msg);
      } else {
        setServerError(err.response?.data?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 mb-6 group"
        >
          <div className="bg-indigo-600 text-white p-2 rounded-xl group-hover:bg-indigo-700 transition">
            <MdReceiptLong size={22} />
          </div>
          <span className="text-2xl font-extrabold text-indigo-600 tracking-tight group-hover:text-indigo-700 transition">
            SplitEase
          </span>
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Log in to your account to continue.
            </p>
          </div>

          {serverError && (
            <div
              role="alert"
              aria-live="polite"
              className="flex items-center gap-2 px-4 py-3 mb-2 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600"
            >
              <MdError size={18} className="shrink-0" />
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
                  <MdEmail size={18} />
                </span>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={(e) => validateField("email", e.target.value)}
                  required
                  placeholder="you@example.com"
                  autoFocus
                  autoComplete="email"
                  disabled={loading}
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                    errors.email
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  }`}
                />
              </div>
              {errors.email && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="flex items-center gap-2 px-2 py-1 mt-1 text-sm text-red-600"
                >
                  <MdError size={18} className="shrink-0" />
                  {errors.email}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
                  <MdLock size={18} />
                </span>
                <div className="relative mt-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={(e) => validateField("password", e.target.value)}
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    autoComplete="current-password"
                    disabled={loading}
                    className={`w-full pl-9 pr-10 py-2.5 rounded-lg border text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                      errors.password
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    }`}
                  />
                  <NewEye
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-900 hover:text-gray-700"
                    onClick={() => setShowPassword((prev) => !prev)}
                  />
                </div>
              </div>
              {errors.password && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="flex items-center gap-2 px-2 py-1 mt-1 text-sm text-red-600"
                >
                  <MdError size={18} className="shrink-0" />
                  {errors.password}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition cursor-pointer"
            >
              <MdLogin size={18} />
              {loading ? "Logging In..." : "Log In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 font-medium hover:text-indigo-700"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
