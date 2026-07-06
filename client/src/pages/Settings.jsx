import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user, updateUser } = useAuth();

  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    setProfileLoading(true);
    try {
      const response = await api.put("/auth/profile", profileForm);
      updateUser(response.data.user);
      setProfileSuccess("Profile updated successfully!");
    } catch (err) {
      setProfileError(err.response?.data?.message || "Something went wrong");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    setPasswordLoading(true);
    try {
      await api.put("/auth/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordSuccess("Password changed successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Something went wrong");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-56 flex-1 px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your account details.</p>
        </div>

        <div className="max-w-2xl space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-5">Edit Profile</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-5">
              {profileError && <p className="text-red-500 text-sm">{profileError}</p>}
              {profileSuccess && <p className="text-green-500 text-sm">{profileSuccess}</p>}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={profileForm.firstName}
                  onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                  required
                  placeholder="Vidhi"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={profileForm.lastName}
                  onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                  required
                  placeholder="Patel"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  required
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
              <button
                type="submit"
                disabled={profileLoading}
                className="w-full px-3.5 py-2.5 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
              >
                {profileLoading ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-5">Change Password</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
              {passwordSuccess && <p className="text-green-500 text-sm">{passwordSuccess}</p>}
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                <div>
                  <input className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" type="password" name="currentPassword" id="currentPassword" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} required minLength={6} placeholder="Current Password" />
                </div>
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                <div>
                  <input className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" type="password" name="newPassword" id="newPassword" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} minLength={6} required placeholder="New Password" />
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                <div>
                  <input className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" type="password" name="confirmPassword" id="confirmPassword" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} minLength={6} required placeholder="Confirm Password" />
                </div>
              </div>
              <button type="submit" disabled={passwordLoading} className="w-full px-3.5 py-2.5 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
                {passwordLoading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}