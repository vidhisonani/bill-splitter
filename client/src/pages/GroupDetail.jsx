import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { HiOutlineArrowLeft, HiOutlineUserPlus } from 'react-icons/hi2';
import Sidebar from '../components/Sidebar';

export default function GroupDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState(null);
  const [memberEmail, setMemberEmail] = useState("");
  const [memberError, setMemberError] = useState("");
  const [memberLoading, setMemberLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("expenses");
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseError, setExpenseError] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [expenseLoading, setExpenseLoading] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    title: "",
    amount: "",
    paidBy: "",
    splitAmong: []
  });

  const fetchGroupAndExpenses = async () => {
    try {
      const groupRes = await api.get(`/groups/${id}`);
      setGroup(groupRes.data.group);

      setExpenseForm(prev => ({
        ...prev,
        paidBy: prev.paidBy || user._id,
        splitAmong: prev.splitAmong.length > 0 ? prev.splitAmong : groupRes.data.group.members.map(m => m._id)
      }));

      const expensesRes = await api.get(`/groups/${id}/expenses`);
      setExpenses(expensesRes.data.expenses);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupAndExpenses();
  }, [id]);

  const getInitials = (firstName, lastName) =>
    `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

  const avatarColors = [
    "bg-indigo-500", "bg-pink-500", "bg-emerald-500",
    "bg-amber-500", "bg-sky-500", "bg-violet-500"
  ];

  const getBalances = () => {
    if (!group || expenses.length === 0) return [];

    const balanceMap = {};
    group.members.forEach(m => {
      balanceMap[m._id] = 0;
    });

    expenses.forEach(exp => {
      const paidById = exp.paidBy?._id;
      const amount = exp.amount;
      const splitCount = exp.splitAmong?.length || 0;
      if (splitCount === 0) return;

      const share = amount / splitCount;

      if (paidById && balanceMap[paidById] !== undefined) {
        balanceMap[paidById] += amount;
      }

      exp.splitAmong?.forEach(member => {
        const memberId = member._id;
        if (balanceMap[memberId] !== undefined) {
          balanceMap[memberId] -= share;
        }
      });
    });

    return group.members.map((m, index) => ({
      member: m,
      balance: balanceMap[m._id] || 0,
      colorClass: avatarColors[index % avatarColors.length]
    }));
  };

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

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (expenseForm.splitAmong.length === 0) {
      setExpenseError("Please select at least one member to split the expense with.");
      return;
    }
    setExpenseError("");
    setExpenseLoading(true);
    try {
      await api.post(`/groups/${id}/expenses`, expenseForm);
      setShowExpenseModal(false);
      setExpenseForm({
        title: "",
        amount: "",
        paidBy: user._id,
        splitAmong: group?.members.map(m => m._id) || []
      });
      fetchGroupAndExpenses();
    } catch (err) {
      setExpenseError(err.response?.data?.message || "Something went wrong");
    } finally {
      setExpenseLoading(false);
    }
  }

  const totalExpense = () => {
    try {
      let totalAmount = 0;
      expenses.forEach(expense => {
        totalAmount += expense.amount;
      });
      return totalAmount;
    } catch (err) {
      console.log(err);
    }
  }

  const myPaid = () => {
    let totalAmount = 0;
    expenses.forEach(expense => {
      if (expense.paidBy._id === user._id) {
        totalAmount += expense.amount;
      }
    })
    return totalAmount;
  }

  const youOwed = () => {
    let totalAmount = 0;
    expenses.forEach(expense => {
      const paidByMe = expense.paidBy?._id === user._id;
      const involved = expense.splitAmong?.some(m => m._id === user._id);
      if (!paidByMe && involved) {
        totalAmount += expense.amount / (expense.splitAmong?.length || 1);
      }
    });
    return totalAmount;
  };

  const getSimplifiedDebts = () => {
    const balances = getBalances();
    if (balances.length === 0) return [];

    const creditors = balances
      .filter(b => b.balance > 0.01)
      .map(b => ({ member: b.member, amount: b.balance }))
      .sort((a, b) => b.amount - a.amount);

    const debtors = balances
      .filter(b => b.balance < -0.01)
      .map(b => ({ member: b.member, amount: Math.abs(b.balance) }))
      .sort((a, b) => b.amount - a.amount);

    const transactions = [];
    let i = 0, j = 0;

    while (i < debtors.length && j < creditors.length) {
      const amount = Math.min(debtors[i].amount, creditors[j].amount);
      transactions.push({
        from: debtors[i].member,
        to: creditors[j].member,
        amount: amount.toFixed(2)
      });
      debtors[i].amount -= amount;
      creditors[j].amount -= amount;
      if (debtors[i].amount < 0.01) i++;
      if (creditors[j].amount < 0.01) j++;
    }

    return transactions;
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
      <Sidebar />

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
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
              onClick={() => {
                setExpenseForm({
                  title: "",
                  amount: "",
                  paidBy: user._id,
                  splitAmong: group?.members.map(m => m._id) || []
                });
                setExpenseError("");
                setShowExpenseModal(true);
              }}
            >
              + Add Expense
            </button>
          </div>
        </div>
        <div className='grid grid-cols-3 gap-6 mb-6'>
          <div className='bg-white rounded-xl border border-gray-200 p-5'>
            <div className='text-sm font-semibold text-gray-900'>Total Group Expenses</div>
            <div className='text-sm font-medium text-gray-500'>₹{totalExpense().toFixed(2)}</div>
          </div>
          <div className='bg-white rounded-xl border border-gray-200 p-5'>
            <div className='text-sm font-semibold text-gray-900'>You Paid</div>
            <div className='text-sm font-medium text-green-400'>₹{myPaid().toFixed(2)}</div>
          </div>
          <div className='bg-white rounded-xl border border-gray-200 p-5'>
            <div className='text-sm font-semibold text-gray-900'>You Are Owed</div>
            <div className='text-sm font-medium text-red-400'>₹{youOwed().toFixed(2)}</div>
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
                  className={`py-3.5 px-4 text-sm font-medium border-b-2 transition ${activeTab === "expenses"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                  Expenses
                </button>
                <button
                  onClick={() => setActiveTab("balances")}
                  className={`py-3.5 px-4 text-sm font-medium border-b-2 transition ${activeTab === "balances"
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
                  expenses.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <p className="text-sm">No expenses yet.</p>
                      <p className="text-xs mt-1">Add the first expense to get started.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {expenses.map((expense) => {
                        const paidByUser = expense.paidBy?._id === user._id;
                        const involved = expense.splitAmong?.some(m => m._id === user._id);
                        const shareAmount = involved ? (expense.amount / (expense.splitAmong?.length || 1)) : 0;

                        return (
                          <div key={expense._id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
                                {expense.title ? expense.title[0].toUpperCase() : "E"}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 text-sm">{expense.title}</h4>
                                <p className="text-xs text-gray-400">
                                  Paid by {paidByUser ? "you" : `${expense.paidBy?.firstName} ${expense.paidBy?.lastName}`} • {new Date(expense.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-gray-900">₹{expense.amount.toFixed(2)}</p>
                              {paidByUser ? (
                                involved ? (
                                  <p className="text-xs text-emerald-500 font-medium">
                                    You lent ₹{(expense.amount - shareAmount).toFixed(2)}
                                  </p>
                                ) : (
                                  <p className="text-xs text-emerald-500 font-medium">
                                    You lent ₹{expense.amount.toFixed(2)}
                                  </p>
                                )
                              ) : involved ? (
                                <p className="text-xs text-red-500 font-medium">
                                  You owe ₹{shareAmount.toFixed(2)}
                                </p>
                              ) : (
                                <p className="text-xs text-gray-400">Not involved</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )
                )}
                {activeTab === "balances" && (
                  expenses.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <p className="text-sm">No balances yet.</p>
                      <p className="text-xs mt-1">Add expenses to see who owes what.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {getBalances().map(({ member, balance, colorClass }) => {
                        const isYou = member._id === user._id;
                        return (
                          <div key={member._id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center text-white text-xs font-semibold`}>
                                {getInitials(member.firstName, member.lastName)}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 text-sm">
                                  {isYou ? "You" : `${member.firstName} ${member.lastName}`}
                                </h4>
                                <p className="text-xs text-gray-400">{member.email}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              {balance > 0 ? (
                                <p className="text-sm font-semibold text-emerald-500">Gets back ₹{balance.toFixed(2)}</p>
                              ) : balance < 0 ? (
                                <p className="text-sm font-semibold text-red-500">Owes ₹{Math.abs(balance).toFixed(2)}</p>
                              ) : (
                                <p className="text-sm font-semibold text-gray-400 font-medium">Settled up</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {/* Simplified settlement plan */}
                      {getSimplifiedDebts().length > 0 && (
                        <div className="mt-6 bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                          <p className="text-xs font-bold text-indigo-700 uppercase tracking-widest mb-3">
                            Simplified settlement plan
                          </p>
                          <div className="space-y-2">
                            {getSimplifiedDebts().map((t, i) => (
                              <div key={i} className="flex items-center justify-between bg-white px-3 py-2.5 rounded-lg border border-indigo-50">
                                <span className="text-sm text-slate-600">
                                  <span className="font-semibold text-slate-900">
                                    {t.from._id === user._id ? "You" : `${t.from.firstName} ${t.from.lastName} `}
                                    {" "}
                                  </span>
                                  <span>{t.from._id === user._id ? "pay" : "pays"}</span>
                                  {" to "}
                                  <span className="font-semibold text-slate-900">
                                    {t.to._id === user._id ? "you" : `${t.to.firstName} ${t.to.lastName}`}
                                  </span>
                                </span>
                                <span className="font-bold text-indigo-600">₹{t.amount}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add expense form */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Add Expense</h2>
            <p className="text-sm text-gray-500 mb-5">Add a new expense to the group.</p>

            {expenseError && (
              <p className="text-xs text-red-500 mb-3 bg-red-50 p-2.5 rounded-lg border border-red-100">{expenseError}</p>
            )}

            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Expense description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={expenseForm.title}
                  onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                  placeholder="e.g. Goa Dinner, Grocery, Fuel"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Amount (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Paid by <span className="text-red-500">*</span>
                </label>
                <select
                  value={expenseForm.paidBy}
                  onChange={(e) => setExpenseForm({ ...expenseForm, paidBy: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm cursor-pointer"
                >
                  {group.members.map(m => (
                    <option key={m._id} value={m._id}>
                      {m._id === user._id ? "You" : `${m.firstName} ${m.lastName}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Split among <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setExpenseForm({ ...expenseForm, splitAmong: group.members.map(m => m._id) })}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
                    >
                      Select All
                    </button>
                    <span className="text-gray-300 text-xs">|</span>
                    <button
                      type="button"
                      onClick={() => setExpenseForm({ ...expenseForm, splitAmong: [] })}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
                    >
                      Select None
                    </button>
                  </div>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {group.members.map((m) => {
                    const isChecked = expenseForm.splitAmong.includes(m._id);
                    return (
                      <label key={m._id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const updated = e.target.checked
                              ? [...expenseForm.splitAmong, m._id]
                              : expenseForm.splitAmong.filter(id => id !== m._id);
                            setExpenseForm({ ...expenseForm, splitAmong: updated });
                          }}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <span>{m._id === user._id ? "You" : `${m.firstName} ${m.lastName}`}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowExpenseModal(false);
                    setExpenseForm({
                      title: "",
                      amount: "",
                      paidBy: user._id,
                      splitAmong: group?.members.map(m => m._id) || []
                    });
                    setExpenseError("");
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={expenseLoading}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-medium transition"
                >
                  {expenseLoading ? "Adding..." : "Add Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}