import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { HiOutlineSquares2X2, HiOutlineUsers, HiOutlineCurrencyRupee, HiOutlineCog6Tooth, HiOutlineArrowUpRight, HiOutlineArrowDownLeft, HiOutlineArrowRightOnRectangle, HiOutlinePlus } from 'react-icons/hi2';

function Dashboard() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [groupForm, setGroupForm] = useState({ name: "", description: "" });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get("/groups");
        setGroups(response.data.groups);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (firstName, lastName) =>
    `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

  const avatarColors = [
    "bg-indigo-500", "bg-pink-500", "bg-emerald-500",
    "bg-amber-500", "bg-sky-500", "bg-violet-500"
  ];

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/groups", groupForm);
      setGroups([...groups, response.data.group]);
      setShowModal(false);
      setGroupForm({ name: "", description: "" });
    } catch (err) {
      console.log(err);
    }
  };
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-gray-400 text-sm">Loading...</div>
    </div>
  );
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Side */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col fixed h-full">
        <div className="px-5 py-5 border-b border-gray-100">
          <span className="text-indigo-600 font-bold text-lg">SplitEase</span>
          <p className="text-xs text-gray-400 mt-0.5">Expense Splitter</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <Link to="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-600 text-sm font-medium">
            <HiOutlineSquares2X2 className="w-5 h-5" /> Dashboard
          </Link>
          <Link to="/groups"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
            <HiOutlineUsers className="w-5 h-5" /> Groups
          </Link>
          <Link to="/expenses"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
            <HiOutlineCurrencyRupee className="w-5 h-5" /> Expenses
          </Link>
          <Link to="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
            <HiOutlineCog6Tooth className="w-5 h-5" /> Settings
          </Link>
        </nav>

        <div className="px-3 py-4 border-t border-gray-100 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
              {getInitials(user?.firstName, user?.lastName)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-500 text-sm transition">
            <HiOutlineArrowRightOnRectangle className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main  */}
      <main className="ml-56 flex-1 px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Here is a summary of your shared expenses.
            </p>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
            + Add Expense
          </button>
        </div>

        {/* Balance  */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total owed to you</p>
              <p className="text-2xl font-bold text-emerald-500">+₹0.00</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500">
              <HiOutlineArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total you owe</p>
              <p className="text-2xl font-bold text-red-500">-₹0.00</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
              <HiOutlineArrowDownLeft className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Groups  */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Your Groups</h2>
          <Link to="/groups" className="text-sm text-indigo-600 hover:text-indigo-700">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Create new group card */}
          <button onClick={() => setShowModal(true)}
          className="bg-white rounded-xl border-2 border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 p-6 flex flex-col items-center justify-center gap-2 transition group">
            <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-indigo-100 flex items-center justify-center text-gray-400 group-hover:text-indigo-500 text-xl transition">
              <HiOutlinePlus className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-gray-500 group-hover:text-indigo-600 transition">
              Create New Group
            </p>
            <p className="text-xs text-gray-400">Start splitting with friends</p>
          </button>

          {/* Group cards */}
          {groups.slice(0, 3).map((group, index) => (
            <Link
              key={group._id}
              to={`/groups/${group._id}`}
              className="bg-white rounded-xl border border-gray-200 hover:shadow-md p-5 flex flex-col gap-4 transition"
            >
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-lg ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white text-sm font-bold`}>
                  {group.name[0].toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-gray-400">₹0.00</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{group.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {group.members.length} member{group.members.length !== 1 ? "s" : ""}
                </p>
              </div>
              {/* Member avatars */}
              <div className="flex -space-x-2">
                {group.members.slice(0, 3).map((member, i) => (
                  <div
                    key={member._id}
                    title={`${member.firstName} ${member.lastName}`}
                    className={`w-7 h-7 rounded-full ${avatarColors[i % avatarColors.length]} border-2 border-white flex items-center justify-center text-white text-xs font-medium`}
                  >
                    {getInitials(member.firstName, member.lastName)}
                  </div>
                ))}
                {group.members.length > 3 && (
                  <div className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-gray-500 text-xs font-medium">
                    +{group.members.length - 3}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </main>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Create a Group</h2>
            <p className="text-sm text-gray-500 mb-5">Give your group a name to get started.</p>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Group name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={groupForm.name}
                  onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                  placeholder="e.g. Goa Trip, Flat 4B"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={groupForm.description}
                  onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })}
                  placeholder="e.g. March trip expenses"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setGroupForm({ name: "", description: "" });
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;