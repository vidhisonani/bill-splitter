import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { Link } from 'react-router-dom';
import { HiOutlineExclamationTriangle, HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import LoadingScreen from "../components/LoadingScreen";

export default function Expenses() {
  const [myExpenses, setMyExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterType, setFilterType] = useState("all");
  const [expenseError, setExpenseError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await api.get("/expenses")
        setMyExpenses(response.data.expenses);
        setExpenseError("");
      } catch (err) {
        console.log(err);
        setExpenseError(err?.response?.data?.message || "Failed to fetch expenses. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchExpenses();
  }, []);

  const avatarColors = [
    "bg-indigo-500", "bg-pink-500", "bg-emerald-500",
    "bg-amber-500", "bg-sky-500", "bg-violet-500"
  ];

  const enriched = useMemo(() => myExpenses.map((expense, index) => {
    const paidByUser = expense.paidBy?._id === user._id;
    const involved = expense.splitAmong?.some(m => m._id === user._id);
    const shareAmount = involved ? (expense.amount / (expense.splitAmong?.length || 1)) : 0;
    const type = paidByUser ? "lent" : involved ? "owe" : "none";
    return { ...expense, paidByUser, involved, shareAmount, type, originalIndex: index };
  }), [myExpenses, user._id]);

  const totalLent = enriched.reduce((sum, e) => {
    if (e.paidByUser && e.involved) return sum + (e.amount - e.shareAmount);
    if (e.paidByUser && !e.involved) return sum + e.amount;
    return sum;
  }, 0);

  const totalOwe = enriched.reduce((sum, e) => {
    if (!e.paidByUser && e.involved) return sum + e.shareAmount;
    return sum;
  }, 0);

  const filtered = useMemo(() => {
    let result = [...enriched];

    if (filterType !== "all") {
      result = result.filter(e => e.type === filterType);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.group?.name?.toLowerCase().includes(q) ||
        e.paidBy?.firstName?.toLowerCase().includes(q)
      );
    }

    if (sortBy === "newest") result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy === "oldest") result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sortBy === "highest") result.sort((a, b) => b.amount - a.amount);
    if (sortBy === "lowest") result.sort((a, b) => a.amount - b.amount);

    return result;
  }, [enriched, filterType, search, sortBy]);

  if (loading) return <LoadingScreen />

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="md:ml-56 flex-1 px-4 md:px-8 pt-24 pb-24 md:py-8">
        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">All Expenses</h1>
          <p className="text-sm text-gray-500 mt-0.5">Every expense you're part of, across all groups.</p>
        </div>
        {/*state cards  */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">Total expenses</p>
            <p className="text-xl font-bold text-gray-900">{myExpenses.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">You lent in total</p>
            <p className="text-xl font-bold text-emerald-500">₹{totalLent.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">You owe in total</p>
            <p className="text-xl font-bold text-red-500">₹{totalOwe.toFixed(2)}</p>
          </div>
        </div>
        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          {/* Search */}
          <div className="relative flex-1">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title, group, or person..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            {[
              { value: "all", label: "All" },
              { value: "lent", label: "You lent" },
              { value: "owe", label: "You owe" },
            ].map(f => (
              <button
                key={f.value}
                onClick={() => setFilterType(f.value)}
                className={`px-3 py-2 text-xs font-medium rounded-lg border transition ${filterType === f.value
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="highest">Highest amount</option>
            <option value="lowest">Lowest amount</option>
          </select>
        </div>

        {/* Results count */}
        {search || filterType !== "all" ? (
          <p className="text-xs text-gray-400 mb-3">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>
        ) : null}
        {expenseError && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <HiOutlineExclamationTriangle className="w-4 h-4 shrink-0" />
            <span>{expenseError}</span>
          </div>
        )}
        {/* Expense list */}
        {filtered.length === 0 && !expenseError ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500 font-medium">No expenses found</p>
            <p className="text-sm text-gray-400 mt-1">
              {search ? "Try a different search term" : "Add expenses inside a group to see them here"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((expense) => (
              <div key={expense._id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between hover:shadow-sm transition">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg ${avatarColors[expense.originalIndex % avatarColors.length]} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                    {expense.title.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{expense.title}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Link
                        to={`/groups/${expense.group?._id}`}
                        className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full hover:bg-indigo-100 transition"
                      >
                        {expense.group?.name}
                      </Link>
                      <span className="text-xs text-gray-400">
                        {new Date(expense.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Paid by {expense.paidByUser ? "you" : `${expense.paidBy?.firstName} ${expense.paidBy?.lastName}`}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-sm font-semibold text-gray-900">₹{expense.amount.toFixed(2)}</p>
                  {expense.paidByUser ? (
                    expense.involved ? (
                      <span className="text-xs font-medium text-emerald-500">
                        You lent ₹{(expense.amount - expense.shareAmount).toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-emerald-500">
                        You lent ₹{expense.amount.toFixed(2)}
                      </span>
                    )
                  ) : expense.involved ? (
                    <span className="text-xs font-medium text-red-500">
                      You owe ₹{expense.shareAmount.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-gray-400">Not involved</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}