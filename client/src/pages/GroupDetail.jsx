import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { HiOutlineArrowLeft, HiOutlineExclamationTriangle } from 'react-icons/hi2';
import Sidebar from '../components/Sidebar';
import DeleteGroupModal from '../components/DeleteGroupModal';
import AddExpenseModal from '../components/AddExpenseModal';
import MembersCard from '../components/MembersCard';
import AddMemberCard from '../components/AddMemberCard';
import { getInitials, avatarColors } from '../utils/avatar';
import LoadingScreen from '../components/LoadingScreen';
import ExpenseDetailCard from '../components/ExpenseDetailCard';

export default function GroupDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("expenses");
  const [expenses, setExpenses] = useState([]);
  const [showExpenseCard, setShowExpenseCard] = useState(false);
  const [expenseId, setExpenseId] = useState(false);

  const fetchGroupAndExpenses = async () => {
    setLoading(true);
    try {
      const [groupRes, expensesRes] = await Promise.all([
        api.get(`/groups/${id}`),
        api.get(`/groups/${id}/expenses`)
      ]);
      setGroup(groupRes.data.group);
      setExpenses(expensesRes.data.expenses);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch group data");
      if (err.response?.status === 404 || err.response?.status === 403) {
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupAndExpenses();
  }, [id]);


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

  if (loading) return <LoadingScreen />

  // if (!group) return (
  //   <div className="flex items-center justify-center min-h-screen bg-gray-50">
  //     <div className="text-gray-400 text-sm">Group not found.</div>
  //   </div>
  // );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      {/* Main */}
      <main className="md:ml-56 flex-1 px-4 md:px-8 pt-24 pb-24 md:py-8">
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
              {group.createdAt && (
                <p className="text-sm text-gray-400 mt-1"> Created on {new Date(group.createdAt).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}</p>
              )}
            </div>
            <AddExpenseModal id={group._id} user={user} group={group} fetchGroupAndExpenses={fetchGroupAndExpenses} />
          </div>
        </div>
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 mb-6">
            <HiOutlineExclamationTriangle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {/* stats cards */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-6'>
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
        <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-6">
          {/* Left column: members + add member */}
          <div className="col-span-1 space-y-4 order-2 sm:order-none">
            {/* Members card */}
            <MembersCard members={group.members} />
            {/* Add member card */}
            <AddMemberCard id={group._id} fetchGroupAndExpenses={fetchGroupAndExpenses} />
            {/* Delete Group */}
            <DeleteGroupModal groupId={group._id} group={group} />
          </div>

          {/* Right column: tabs */}
          <div className="col-span-2 order-1 sm:order-none">
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
                          <div key={expense._id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition cursor-pointer"
                            onClick={() => { setShowExpenseCard(true), setExpenseId(expense._id) }}
                          >

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
                      {showExpenseCard && <ExpenseDetailCard expenseId={expenseId} onClose={() => setShowExpenseCard(false)} refreshExpenses={fetchGroupAndExpenses} />}
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
    </div>
  );
}