import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { HiOutlineArrowUpRight, HiOutlineArrowDownLeft, HiOutlinePlus, HiOutlineCheck, HiOutlineExclamationTriangle } from 'react-icons/hi2';
import { MdError } from 'react-icons/md';
import LoadingScreen from '../components/LoadingScreen';
import toast from 'react-hot-toast';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function Friends() {
  useDocumentTitle("Friends | SplitEase");

  const { user } = useAuth();
  const [balances, setBalances] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [form, setForm] = useState({ email: "", message: "" });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [sentRequests, setSentRequests] = useState([]);
  const [requestTab, setRequestTab] = useState("received"); // "received" Or "sent"
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [balancesRes, requestsRes, sentRes] = await Promise.all([
          api.get("/friends/balances"),
          api.get("/friends/requests"),
          api.get("/friends/requests/sent")
        ]);
        setBalances(balancesRes.data.balances || []);
        setRequests(requestsRes.data || []);
        setSentRequests(sentRes.data || []);
      } catch (err) {
        console.log(err);
        setError(err.response?.data?.message || "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSendRequest = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    try {
      await api.post("/friends/request", {
        receiverEmail: form.email.trim(),
        message: form.message.trim()
      });
      setRequestSent(true);
      setForm({ email: "", message: "" });
    } catch (err) {
      setFormError(err.response?.data?.message || "Something went wrong");
    } finally {
      setFormLoading(false);
    }
  };

  const handleRespond = async (requestId, status) => {
    try {
      await api.put(`/friends/requests/${requestId}`, { status });
      setRequests(prev => prev.filter(r => r._id !== requestId));
      if (status === "accepted") {
        const res = await api.get("/friends/balances");
        setBalances(res.data.balances || []);
        toast.success("Request accepted successfully.");
      }
    } catch (err) {
      toast.error("Failed to update request.");
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      await api.delete(`/friends/requests/${requestId}`);
      setSentRequests(prev => prev.filter(r => r._id !== requestId));
      toast.success("Request cancelled successfully.");
    } catch (err) {
      toast.error("Failed to cancel request.");
    }
  };

  if (loading) return <LoadingScreen />

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="md:ml-56 flex-1 px-4 md:px-8 pt-24 pb-24 md:py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user?.firstName}'s All Friends
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Here are your friends.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition cursor-pointer">
            <HiOutlinePlus className="w-5 h-5" strokeWidth='3px' />
            Add Friend
          </button>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <HiOutlineExclamationTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {/* balances */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total owed to you</p>
              <p className="text-2xl font-bold text-emerald-500">
                +₹{balances.reduce((sum, b) => b.netBalance > 0 ? sum + b.netBalance : sum, 0).toFixed(2)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500">
              <HiOutlineArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total you owe</p>
              <p className="text-2xl font-bold text-red-500">
                -₹{balances.reduce((sum, b) => b.netBalance < 0 ? sum + Math.abs(b.netBalance) : sum, 0).toFixed(2)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
              <HiOutlineArrowDownLeft className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Friend Requests</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
            {/* Tab headers */}
            <div className="flex gap-4 border-b border-gray-200 mb-4">
              <button
                onClick={() => setRequestTab("received")}
                className={`pb-2.5 text-sm font-medium border-b-2 transition cursor-pointer ${requestTab === "received"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
              >
                Received {requests.length > 0 && (
                  <span className="ml-1.5 bg-amber-100 text-amber-700 text-xs px-1.5 py-0.5 rounded-full">
                    {requests.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setRequestTab("sent")}
                className={`pb-2.5 text-sm font-medium border-b-2 transition cursor-pointer ${requestTab === "sent"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
              >
                Sent {sentRequests.length > 0 && (
                  <span className="ml-1.5 bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded-full">
                    {sentRequests.length}
                  </span>
                )}
              </button>
            </div>

            {/* Received tab */}
            {requestTab === "received" && (
              requests.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No pending requests</p>
              ) : (
                <div className="space-y-3">
                  {requests.map(req => (
                    <div key={req._id} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {req.sender.firstName} {req.sender.lastName}
                        </p>
                        <p className="text-xs text-gray-400">{req.sender.email}</p>
                        {req.message && (
                          <p className="text-xs text-gray-500 mt-0.5 italic">"{req.message}"</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRespond(req._id, "accepted")}
                          className="px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition cursor-pointer"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRespond(req._id, "rejected")}
                          className="px-3 py-1.5 text-xs font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg transition cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* Sent tab */}
            {requestTab === "sent" && (
              sentRequests.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No pending sent requests</p>
              ) : (
                <div className="space-y-3">
                  {sentRequests.map(req => (
                    <div key={req._id} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {req.receiver.firstName} {req.receiver.lastName}
                        </p>
                        <p className="text-xs text-gray-400">{req.receiver.email}</p>
                        {req.message && (
                          <p className="text-xs text-gray-500 mt-0.5 italic">"{req.message}"</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
                          Pending
                        </span>
                        <button
                          onClick={() => handleCancelRequest(req._id)}
                          className="px-3 py-1.5 text-xs font-medium border border-red-200 text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
        {/* Friends list */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            All Friends ({balances.length})
          </h2>
          {balances.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <p className="text-gray-500 font-medium">No friends yet</p>
              <p className="text-sm text-gray-400 mt-1">Add a friend to start splitting expenses together</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition cursor-pointer"
              >
                Add your first friend
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {balances.map(({ friend, netBalance }) => (
                <div key={friend._id} className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">
                        {friend.firstName?.[0]}{friend.lastName?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {friend.firstName} {friend.lastName}
                        </p>
                        <p className="text-xs text-gray-400">{friend.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {netBalance > 0 ? (
                        <div>
                          <p className="text-xs text-emerald-500 font-medium uppercase tracking-wide">Owes you</p>
                          <p className="text-sm font-bold text-emerald-500">₹{netBalance.toFixed(2)}</p>
                        </div>
                      ) : netBalance < 0 ? (
                        <div>
                          <p className="text-xs text-red-500 font-medium uppercase tracking-wide">You owe</p>
                          <p className="text-sm font-bold text-red-500">₹{Math.abs(netBalance).toFixed(2)}</p>
                        </div>
                      ) : (
                        <p className="text-sm font-medium text-gray-400">Settled up</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Add your friends</h2>
            <p className="text-sm text-gray-500 mb-5">Enter your friend's email to add them to your friend list.</p>
            {requestSent ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                  <HiOutlineCheck className="w-5 h-5 text-green-600" strokeWidth='2px' />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Request Sent!</h3>
                <p className="text-sm text-gray-500 mb-5">
                  They'll appear in your friends list once they accept.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setRequestSent(false); }}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition cursor-pointer"
                  >
                    Send Another
                  </button>
                  <button
                    onClick={() => { setShowModal(false); setRequestSent(false); }}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendRequest} className="space-y-4">
                {formError && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                    <MdError size={18} className="shrink-0" />
                    {formError}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    autoFocus
                    disabled={formLoading}
                    value={form.email}
                    onChange={(e) => {
                      setForm({ ...form, email: e.target.value });
                      if (formError) setFormError("");
                    }}
                    placeholder="friend@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Message <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    disabled={formLoading}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="e.g. March trip expenses"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    disabled={formLoading}
                    onClick={() => {
                      setShowModal(false);
                      setForm({ email: "", message: "" });
                      setFormError("");
                    }}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-medium transition cursor-pointer"
                  >
                    {formLoading ? "Sending..." : "Add Friend"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}