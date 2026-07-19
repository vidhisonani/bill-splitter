import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdPerson,
  MdEmail,
  MdLock,
  MdSave,
  MdSecurity,
  MdManageAccounts,
  MdCheckCircle,
  MdError,
} from "react-icons/md";
import {
  HiOutlineArrowRightOnRectangle,
  HiEye,
  HiEyeSlash,
} from "react-icons/hi2";
import Sidebar from "../components/Sidebar";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { getInitials } from "../utils/avatar";
import useDocumentTitle from "../hooks/useDocumentTitle";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "../utils/validation";

export default function Settings() {
  useDocumentTitle("Settings | SplitEase");

  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profErrors, setProfErrors] = useState({});

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passErrors, setPassErrors] = useState({});

  const [showCurrPassword, setShowCurrPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const CurrentEye = showCurrPassword ? HiEyeSlash : HiEye;
  const NewEye = showNewPassword ? HiEyeSlash : HiEye;
  const ConfirmEye = showConfirmPassword ? HiEyeSlash : HiEye;

  // profile form
  const handleProfChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setProfErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    if (profileError) setProfileError("");
    if (profileSuccess) setProfileSuccess("");
  };

  const validateProfileField = (name, value) => {
    let profErrors = "";
    if (name === "firstName") profErrors = validateName(value, "First Name");
    if (name === "lastName") profErrors = validateName(value, "Last Name");
    if (name === "email") profErrors = validateEmail(value);
    setProfErrors((prev) => ({
      ...prev,
      [name]: profErrors,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");

    const firstNameError = validateName(profileForm.firstName, "First Name");
    const lastNameError = validateName(profileForm.lastName, "Last Name");
    const emailError = validateEmail(profileForm.email);

    setProfErrors({
      firstName: firstNameError,
      lastName: lastNameError,
      email: emailError,
    });
    if (firstNameError || lastNameError || emailError) return;

    setProfileLoading(true);

    try {
      const response = await api.put("/auth/profile", {
        firstName: profileForm.firstName.trim(),
        lastName: profileForm.lastName.trim(),
        email: profileForm.email.trim(),
      });
      updateUser(response.data.user);
      setProfileForm({
        firstName: response.data.user.firstName,
        lastName: response.data.user.lastName,
        email: response.data.user.email,
      });
      setProfErrors({});
      setProfileSuccess("Profile updated successfully!");
    } catch (err) {
      if (err.response?.data?.errors) {
        setProfileError(err.response?.data?.errors[0]?.msg);
      } else {
        setProfileError(err.response?.data?.message || "Something went wrong");
      }
    } finally {
      setProfileLoading(false);
    }
  };

  // password field
  const handlePassChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setPassErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    if (passwordError) setPasswordError("");
    if (passwordSuccess) setPasswordSuccess("");
  };

  const validatePasswordField = (name, value) => {
    let passErrors = "";
    if (name === "currentPassword") passErrors = validatePassword(value);
    if (name === "newPassword") passErrors = validatePassword(value);
    if (name === "confirmPassword")
      passErrors = validateConfirmPassword(passwordForm.newPassword, value);
    setPassErrors((prev) => ({
      ...prev,
      [name]: passErrors,
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    const currentPasswordError = validatePassword(passwordForm.currentPassword);
    const newPasswordError = validatePassword(passwordForm.newPassword);
    const confirmPasswordError = validateConfirmPassword(
      passwordForm.newPassword,
      passwordForm.confirmPassword
    );

    setPassErrors({
      currentPassword: currentPasswordError,
      newPassword: newPasswordError,
      confirmPassword: confirmPasswordError,
    });
    if (currentPasswordError || newPasswordError || confirmPasswordError)
      return;

    setPasswordLoading(true);
    try {
      await api.put("/auth/password", {
        currentPassword: passwordForm.currentPassword.trim(),
        newPassword: passwordForm.newPassword.trim(),
      });
      setPasswordSuccess("Password changed successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPassErrors({});
    } catch (err) {
      if (err.response?.data?.errors) {
        setPasswordError(err.response?.data?.errors[0]?.msg);
      } else {
        setPasswordError(err.response?.data?.message || "Something went wrong");
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="md:ml-56 flex-1 px-4 md:px-8 pt-24 pb-24 md:py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your account details.
          </p>
        </div>

        <div className="max-w-2xl space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-5">
              <MdManageAccounts size={20} className="text-indigo-500" />
              <h2 className="text-base font-semibold text-gray-900">
                Edit Profile
              </h2>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-bold select-none">
                {getInitials(user?.firstName, user?.lastName)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-5">
              {profileError && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                  <MdError size={18} className="shrink-0" />
                  {profileError}
                </div>
              )}
              {profileSuccess && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-600">
                  <MdCheckCircle size={18} className="shrink-0" />
                  {profileSuccess}
                </div>
              )}

              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  First Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
                    <MdPerson size={18} />
                  </span>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={profileForm.firstName}
                    onChange={handleProfChange}
                    onBlur={(e) =>
                      validateProfileField("firstName", e.target.value)
                    }
                    disabled={profileLoading}
                    required
                    placeholder="Vidhi"
                    autoComplete="given-name"
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                      profErrors.firstName
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    }`}
                  />
                </div>
                {profErrors.firstName && (
                  <div
                    role="alert"
                    aria-live="polite"
                    className="flex items-center gap-2 px-2 py-1 mt-1 text-sm text-red-600"
                  >
                    <MdError size={18} className="shrink-0" />
                    {profErrors.firstName}
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Last Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
                    <MdPerson size={18} />
                  </span>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={profileForm.lastName}
                    onChange={handleProfChange}
                    onBlur={(e) =>
                      validateProfileField("lastName", e.target.value)
                    }
                    disabled={profileLoading}
                    required
                    placeholder="Patel"
                    autoComplete="family-name"
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                      profErrors.lastName
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    }`}
                  />
                </div>
                {profErrors.lastName && (
                  <div
                    role="alert"
                    aria-live="polite"
                    className="flex items-center gap-2 px-2 py-1 mt-1 text-sm text-red-600"
                  >
                    <MdError size={18} className="shrink-0" />
                    {profErrors.lastName}
                  </div>
                )}
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
                    value={profileForm.email}
                    onChange={handleProfChange}
                    onBlur={(e) =>
                      validateProfileField("email", e.target.value)
                    }
                    disabled={profileLoading}
                    required
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                      profErrors.email
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    }`}
                  />
                </div>
                {profErrors.email && (
                  <div
                    role="alert"
                    aria-live="polite"
                    className="flex items-center gap-2 px-2 py-1 mt-1 text-sm text-red-600"
                  >
                    <MdError size={18} className="shrink-0" />
                    {profErrors.email}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className="cursor-pointer w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
              >
                <MdSave size={18} />
                {profileLoading ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-5">
              <MdSecurity size={20} className="text-indigo-500" />
              <h2 className="text-base font-semibold text-gray-900">
                Change Password
              </h2>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              {passwordError && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                  <MdError size={18} className="shrink-0" />
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-600">
                  <MdCheckCircle size={18} className="shrink-0" />
                  {passwordSuccess}
                </div>
              )}

              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Current Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
                    <MdLock size={18} />
                  </span>
                  <div className="relative mt-2">
                    <input
                      type={showCurrPassword ? "text" : "password"}
                      name="currentPassword"
                      id="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePassChange}
                      onBlur={(e) =>
                        validatePasswordField("currentPassword", e.target.value)
                      }
                      disabled={passwordLoading}
                      required
                      minLength={6}
                      placeholder="Current password"
                      autoComplete="current-password"
                      className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                        passErrors.currentPassword
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                      }`}
                    />
                    <CurrentEye
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-900 hover:text-gray-700"
                      onClick={() => setShowCurrPassword((prev) => !prev)}
                    />
                  </div>
                </div>
                {passErrors.currentPassword && (
                  <div
                    role="alert"
                    aria-live="polite"
                    className="flex items-center gap-2 px-2 py-1 mt-1 text-sm text-red-600"
                  >
                    <MdError size={18} className="shrink-0" />
                    {passErrors.currentPassword}
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  New Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
                    <MdLock size={18} />
                  </span>
                  <div className="relative mt-2">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      id="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePassChange}
                      onBlur={(e) =>
                        validatePasswordField("newPassword", e.target.value)
                      }
                      disabled={passwordLoading}
                      required
                      minLength={6}
                      placeholder="At least 6 characters"
                      autoComplete="new-password"
                      className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                        passErrors.newPassword
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                      }`}
                    />
                    <NewEye
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-900 hover:text-gray-700"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                    />
                  </div>
                </div>
                {passErrors.newPassword && (
                  <div
                    role="alert"
                    aria-live="polite"
                    className="flex items-center gap-2 px-2 py-1 mt-1 text-sm text-red-600"
                  >
                    <MdError size={18} className="shrink-0" />
                    {passErrors.newPassword}
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Confirm Password
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
                      value={passwordForm.confirmPassword}
                      onChange={handlePassChange}
                      onBlur={(e) =>
                        validatePasswordField("confirmPassword", e.target.value)
                      }
                      disabled={passwordLoading}
                      required
                      minLength={6}
                      placeholder="Re-enter new password"
                      autoComplete="new-password"
                      className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                        passErrors.confirmPassword
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
                {passErrors.confirmPassword && (
                  <div
                    role="alert"
                    aria-live="polite"
                    className="flex items-center gap-2 px-2 py-1 mt-1 text-sm text-red-600"
                  >
                    <MdError size={18} className="shrink-0" />
                    {passErrors.confirmPassword}
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={passwordLoading}
                className="cursor-pointer w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
              >
                <MdSecurity size={18} />
                {passwordLoading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>

          {/* Logout Section */}
          <div className="bg-white rounded-xl border border-red-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <HiOutlineArrowRightOnRectangle
                size={20}
                className="text-red-500"
              />
              <h2 className="text-base font-semibold text-gray-900">
                Sign Out
              </h2>
            </div>
            <p className="text-sm text-gray-500 mb-5">
              Done using SplitEase? You can log out from your current device
              here.
            </p>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg border border-red-200 text-red-600 font-medium hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition cursor-pointer select-none"
            >
              <HiOutlineArrowRightOnRectangle size={18} />
              Log Out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
