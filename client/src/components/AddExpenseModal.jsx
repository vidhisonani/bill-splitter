import { HiOutlinePlus } from "react-icons/hi2";
import { MdError } from "react-icons/md";
import { useState } from "react";
import api from "../api";
import toast from "react-hot-toast";

export default function AddExpenseModal({ id, user, group, fetchGroupAndExpenses }) {
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseError, setExpenseError] = useState("");
  const [expenseLoading, setExpenseLoading] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    title: "",
    amount: "",
    paidBy: "",
    splitAmong: []
  });

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
      toast.success("Expense added successfully");
      fetchGroupAndExpenses();
    } catch (err) {
      setExpenseError(err.response?.data?.message || "Something went wrong");
      // toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setExpenseLoading(false);
    }
  }

  return (
    <>
      <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition cursor-pointer"
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
        <HiOutlinePlus className="w-5 h-5" strokeWidth='3px' />
        Add Expense
      </button>

      {/* expense form */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Add Expense</h2>
            <p className="text-sm text-gray-500 mb-5">Add a new expense to the group.</p>

            {expenseError && (
              <div className='flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg border border-red-200 text-sm text-red-600 mb-3'>
                <MdError size={16} />
                <p>{expenseError}</p>
              </div>
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
    </>
  );
}