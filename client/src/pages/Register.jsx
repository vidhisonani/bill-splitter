import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MdEmail,
  MdLock,
  MdPerson,
  MdPersonAdd,
  MdReceiptLong,
  MdError,
} from "react-icons/md";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import useDocumentTitle from "../hooks/useDocumentTitle";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateName,
} from "../utils/validation";

function Register() {
  useDocumentTitle("Register | SplitEase");

  const { login, token } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const NewEye = showPassword ? HiEyeSlash : HiEye;
  const ConfirmEye = showConfirmPassword ? HiEyeSlash : HiEye;

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [serverError, setServerError] = useState("");
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
    if (name === "firstName") error = validateName(value, "First Name");
    if (name === "lastName") error = validateName(value, "Last Name");
    if (name === "email") error = validateEmail(value);
    if (name === "password") error = validatePassword(value);
    if (name === "confirmPassword")
      error = validateConfirmPassword(formData.password, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const { firstName, lastName, email, password, confirmPassword } = formData;
    const firstNameError = validateName(formData.firstName, "First name");
    const lastNameError = validateName(formData.lastName, "Last name");
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    );
    setErrors({
      firstName: firstNameError,
      lastName: lastNameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    });
    if (
      firstNameError ||
      lastNameError ||
      emailError ||
      passwordError ||
      confirmPasswordError
    )
      return;

    setLoading(true);
    try {
      const { confirmPassword, ...dataToSend } = formData;
      const response = await api.post("/auth/register", dataToSend);
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
              Create your account
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Start splitting bills with friends in minutes.
            </p>
          </div>
          {serverError && (
            <div
              role="alert"
              aria-live="polite"
              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 mb-5"
            >
              <MdError size={18} className="shrink-0" />
              {serverError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  First name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
                    <MdPerson size={18} />
                  </span>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={(e) => validateField("firstName", e.target.value)}
                    required
                    placeholder="Vidhi"
                    disabled={loading}
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                      errors.firstName
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    }`}
                  />
                </div>
                {errors.firstName && (
                  <div
                    role="alert"
                    aria-live="polite"
                    className="flex items-center gap-2 px-2 py-1 mt-1 text-sm text-red-600"
                  >
                    <MdError size={18} className="shrink-0" />
                    {errors.firstName}
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Last name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
                    <MdPerson size={18} />
                  </span>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={(e) => validateField("lastName", e.target.value)}
                    required
                    placeholder="Patel"
                    disabled={loading}
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                      errors.lastName
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    }`}
                  />
                </div>
                {errors.lastName && (
                  <div
                    role="alert"
                    aria-live="polite"
                    className="flex items-center gap-2 px-2 py-1 mt-1 text-sm text-red-600"
                  >
                    <MdError size={18} className="shrink-0" />
                    {errors.lastName}
                  </div>
                )}
              </div>
            </div>

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
                    disabled={loading}
                    placeholder="At least 6 characters"
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
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

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Confirm password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
                  <MdLock size={18} />
                </span>
                <div className="relative mt-2">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={(e) =>
                      validateField("confirmPassword", e.target.value)
                    }
                    required
                    minLength={6}
                    disabled={loading}
                    placeholder="Re-enter your password"
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                      errors.confirmPassword
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    }`}
                  />
                  <ConfirmEye
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-900 hover:text-gray-700"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  />
                </div>
              </div>
              {errors.confirmPassword && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="flex items-center gap-2 px-2 py-1 mt-1 text-sm text-red-600"
                >
                  <MdError size={18} className="shrink-0" />
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition cursor-pointer"
            >
              <MdPersonAdd size={18} />
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-medium hover:text-indigo-700"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
