import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { HiOutlineSquares2X2, HiOutlineUsers, HiOutlineCurrencyRupee, HiOutlineCog6Tooth, HiOutlineArrowRightOnRectangle, HiOutlineArrowLeft, HiOutlineUserPlus } from 'react-icons/hi2';

export default function GroupDetail() {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState(null);
  const [memberEmail, setMemberEmail] = useState("");
  const [memberError, setMemberError] = useState("");
  const [memberLoading, setMemberLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("expenses");

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await api.get(`/groups/${id}`);
        setGroup(response.data.group);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
  }, [id]);

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

  const handleAddMember = async (e) => {
    e.preventDefault();
    setMemberError("");
    setMemberLoading(true);
    try {
      const response = await api.post(`/groups/${id}/members`, { email: memberEmail });
      setGroup(response.data.group);
      setMemberEmail("");
    } catch (err) {
      setMemberError(err.response?.data?.message || "Something went wrong");
    } finally {
      setMemberLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-gray-400 text-sm">Loading...</div>
    </div>
  );

  if (!group) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-gray-400 text-sm">Group not found.</div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col fixed h-full">
        <div className="px-5 py-5 border-b border-gray-100">
          <span className="text-indigo-600 font-bold text-lg">SplitEase</span>
          <p className="text-xs text-gray-400 mt-0.5">Expense Splitter</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <Link to="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
            <HiOutlineSquares2X2 className="w-5 h-5" /> Dashboard
          </Link>
          <Link to="/groups"
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-600 text-sm font-medium">
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
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-500 text-sm transition">
            <HiOutlineArrowRightOnRectangle className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-56 flex-1 px-8 py-8">
        {/* Back button + header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4 transition">
            <HiOutlineArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{group.name}</h1>
              {group.description && (
                <p className="text-sm text-gray-500 mt-1">{group.description}</p>
              )}
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
              + Add Expense
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left column: members + add member */}
          <div className="col-span-1 space-y-4">
            {/* Members card */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">
                Members ({group.members.length})
              </h2>
              <div className="space-y-3">
                {group.members.map((member, i) => (
                  <div key={member._id} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-xs font-medium`}>
                      {getInitials(member.firstName, member.lastName)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="text-xs text-gray-400">{member.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add member card */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <HiOutlineUserPlus className="w-4 h-4" /> Add Member
              </h2>
              {memberError && (
                <p className="text-xs text-red-500 mb-3">{memberError}</p>
              )}
              <form onSubmit={handleAddMember} className="space-y-3">
                <input
                  type="email"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  placeholder="friend@example.com"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
                <button
                  type="submit"
                  disabled={memberLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-medium py-2 rounded-lg transition"
                >
                  {memberLoading ? "Adding..." : "Add Member"}
                </button>
              </form>
            </div>
          </div>

          {/* Right column: tabs */}
          <div className="col-span-2">
            <div className="bg-white rounded-xl border border-gray-200">
              {/* Tabs */}
              <div className="flex border-b border-gray-200 px-5">
                <button
                  onClick={() => setActiveTab("expenses")}
                  className={`py-3.5 px-4 text-sm font-medium border-b-2 transition ${
                    activeTab === "expenses"
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Expenses
                </button>
                <button
                  onClick={() => setActiveTab("balances")}
                  className={`py-3.5 px-4 text-sm font-medium border-b-2 transition ${
                    activeTab === "balances"
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Balances
                </button>
              </div>

              {/* Tab content */}
              <div className="p-5">
                {activeTab === "expenses" && (
                  <div className="text-center py-12 text-gray-400">
                    <p className="text-sm">No expenses yet.</p>
                    <p className="text-xs mt-1">Add the first expense to get started.</p>
                  </div>
                )}
                {activeTab === "balances" && (
                  <div className="text-center py-12 text-gray-400">
                    <p className="text-sm">No balances yet.</p>
                    <p className="text-xs mt-1">Add expenses to see who owes what.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}