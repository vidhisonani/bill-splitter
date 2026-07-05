import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { Link } from 'react-router-dom';

export default function Expenses() {
  const [myExpenses, setMyExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await api.get("/expenses")
        setMyExpenses(response.data.expenses);
      } catch (err) {
        console.log(err);
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

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-gray-400 text-sm">Loading...</div>
    </div>
  );
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-56 flex-1 px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              All Expenses
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              All your expenses in one place.
            </p>
          </div>
        </div>
        {myExpenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 text-gray-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">No expenses yet</p>
            <p className="text-sm text-gray-400 mt-1">Start by adding an expense</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myExpenses.map((expense, index) => {
              const paidByUser = expense.paidBy?._id === user._id;
              const involved = expense.splitAmong?.some(m => m._id === user._id);
              const shareAmount = involved ? (expense.amount / (expense.splitAmong?.length || 1)) : 0;

              return (
                <div key={expense._id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between hover:shadow-sm transition">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                      {expense.title.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{expense.title}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Link
                          to={`/groups/${expense.group._id}`}
                          className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full hover:bg-indigo-100 transition"
                        >
                          {expense.group.name}
                        </Link>
                        <span className="text-xs text-gray-400">
                          {new Date(expense.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Paid by {paidByUser ? "you" : `${expense.paidBy?.firstName} ${expense.paidBy?.lastName}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-sm font-semibold text-gray-900">₹{expense.amount.toFixed(2)}</p>
                    {paidByUser ? (
                      involved ? (
                        <span className="text-xs font-medium text-emerald-500">
                          You lent ₹{(expense.amount - shareAmount).toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-emerald-500">
                          You lent ₹{expense.amount.toFixed(2)}
                        </span>
                      )
                    ) : involved ? (
                      <span className="text-xs font-medium text-red-500">
                        You owe ₹{shareAmount.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-gray-400">Not involved</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  )
}