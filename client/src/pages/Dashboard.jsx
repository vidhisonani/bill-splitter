import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { HiOutlineArrowUpRight, HiOutlineArrowDownLeft, HiOutlinePlus, HiOutlineExclamationTriangle } from 'react-icons/hi2';
import { MdError } from 'react-icons/md';

function Dashboard() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [groupForm, setGroupForm] = useState({ name: "", description: "" });
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [groupError, setGroupError] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get("/groups");
        setGroups(response.data.groups);
        setError("");
      } catch (err) {
        const message = err.response?.data?.message || "Something went wrong";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  const getInitials = (firstName, lastName) =>
    `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

  const avatarColors = [
    "bg-indigo-500", "bg-pink-500", "bg-emerald-500",
    "bg-amber-500", "bg-sky-500", "bg-violet-500"
  ];

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      setGroupError("");
      const response = await api.post("/groups", groupForm);
      const newGroup = { ...response.data.group, userBalance: 0 };
      setGroups([...groups, newGroup]);
      setShowModal(false);
      setGroupForm({ name: "", description: "" });
    } catch (err) {
      const message = err?.response?.data?.message || "Something went wrong";
      setGroupError(message);
    }
  };

  let totalOwed = 0;
  let totalOwe = 0;
  groups.forEach(group => {
    const bal = group.userBalance ?? 0;
    if (bal > 0) {
      totalOwed += bal;
    } else if (bal < 0) {
      totalOwe += Math.abs(bal);
    }
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-gray-400 text-sm">Loading...</div>
    </div>
  );
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main  */}
      <main className="md:ml-56 flex-1 px-4 md:px-8 pt-24 pb-24 md:py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Here is a summary of your shared expenses.
            </p>
          </div>
          {/* <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition cursor-pointer">
            <HiOutlinePlus className="w-5 h-5" strokeWidth='3px' />
            Add Expense
          </button> */}
        </div>

        {/* Balance  */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 mb-4">
            <HiOutlineExclamationTriangle size={18} className="shrink-0" />
            {error}
          </div>
        )}
        {!error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total owed to you</p>
                <p className="text-2xl font-bold text-emerald-500">+₹{totalOwed.toFixed(2)}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500">
                <HiOutlineArrowUpRight className="w-5 h-5" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total you owe</p>
                <p className="text-2xl font-bold text-red-500">-₹{totalOwe.toFixed(2)}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                <HiOutlineArrowDownLeft className="w-5 h-5" />
              </div>
            </div>
          </div>
        )}

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
                {group.userBalance > 0 ? (
                  <span className="text-sm font-semibold text-emerald-500">+₹{group.userBalance.toFixed(2)}</span>
                ) : group.userBalance < 0 ? (
                  <span className="text-sm font-semibold text-red-500">-₹{Math.abs(group.userBalance).toFixed(2)}</span>
                ) : (
                  <span className="text-sm font-semibold text-gray-400">₹0.00</span>
                )}
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
      </main >
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Create a Group</h2>
            <p className="text-sm text-gray-500 mb-5">Give your group a name to get started.</p>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              {groupError && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                  <MdError size={18} className="shrink-0" />
                  {groupError}
                </div>
              )}
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
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition cursor-pointer"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div >
  );
}

export default Dashboard;