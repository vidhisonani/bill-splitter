import { useEffect, useState } from "react";
import { HiOutlineXCircle } from "react-icons/hi2";
import api from "../api";
import LoadingScreen from "./LoadingScreen";
import toast from 'react-hot-toast';
import { useAuth } from "../context/AuthContext";
import DeleteExpenseModal from "./DeleteExpenseModal";

export default function ExpenseDetailCard({ expenseId, onClose, refreshExpenses }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [expense, setExpense] = useState(null);
  const [error, setError] = useState("");
  const [showDelete, setShowDelete] = useState(false);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/expenses/${expenseId}`);
      setExpense(res.data.expense);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch expense data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (error) {
      toast.error(error);
      onClose();
    }
  }, [error]);

  useEffect(() => {
    if (expenseId) {
      fetchExpenses();
    }
  }, [expenseId]);


  const isCreator = expense?.createdBy?._id === user?._id;
  const isPayer = expense?.paidBy?._id === user?._id;
  const share = expense?.amount / expense?.splitAmong?.length;

  if (loading) return (
    <LoadingScreen />
  )

  if (error) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-6 py-5">
          <h2 className="text-xl font-bold text-gray-900">
            Expense Details
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
          >
            <HiOutlineXCircle className="w-7 h-7" />
          </button>
        </div>
        {expense && (
          <div className="p-6">
            <div className="mb-8 text-center">
              <h3 className="mt-1 text-2xl font-bold text-indigo-600 break-words">
                {expense.title}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="rounded-xl border bg-gray-50 p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Amount
                  </p>
                  <p className="text-md font-bold text-gray-900">
                    ₹{expense.amount.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-xl border bg-gray-50 p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Paid By
                  </p>
                  <p className="text-md font-semibold">
                    {isPayer
                      ? "You"
                      : `${expense.paidBy.firstName} ${expense.paidBy.lastName}`}
                  </p>
                </div>
              </div>
              <div className="rounded-xl border bg-gray-50 p-5">
                <div className="grid grid-cols-2 gap-4">
                  <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Date
                  </span>
                  <span className="text-sm font-semibold text-gray-900 text-right">
                    {new Date(expense.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Time
                  </span>
                  <span className="text-sm font-semibold text-gray-900 text-right">
                    {new Date(expense.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Created By
                  </span>
                  <span className="text-sm font-semibold text-gray-900 text-right">
                    {isCreator
                      ? "You"
                      : `${expense.createdBy.firstName} ${expense.createdBy.lastName}`}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Split Among
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {expense.splitAmong.map((member) => {
                  const isYou = member?._id?.toString() === user?._id?.toString();
                  return (
                    <div
                      key={member._id}
                      className="flex items-center justify-between rounded-xl border bg-gray-50 px-4 py-3 hover:bg-gray-100 transition"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {isYou
                            ? "You"
                            : `${member.firstName} ${member.lastName}`}
                        </p>
                      </div>
                      <span className="text-md font-bold text-indigo-600">
                        ₹{share.toFixed(2)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
            {isCreator && (
              <div className="mt-8 border-t pt-6">
                {!showDelete ? (
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowDelete(true)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
                    >
                      Delete Expense
                    </button>
                  </div>
                ) : (
                  <DeleteExpenseModal
                    expenseId={expense._id}
                    onDelete={() => {
                      refreshExpenses();
                      onClose();
                    }}
                    onCancel={() => setShowDelete(false)}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}