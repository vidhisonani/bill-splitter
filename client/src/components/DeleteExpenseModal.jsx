import { useState } from "react";
import api from "../api";
import toast from "react-hot-toast";

export default function DeleteExpenseModal({
  expenseId,
  onDelete,
  onCancel,
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/expenses/${expenseId}`);
      toast.success("Expense deleted successfully");
      onDelete();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to delete expense"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-xl border border-red-200 bg-red-50 p-4">
      <h3 className="text-sm font-semibold text-red-700">
        Delete Expense
      </h3>

      <p className="mt-2 text-sm text-gray-600">
        Are you sure you want to delete this expense?
      </p>

      <p className="mt-1 text-xs text-red-500">
        This action cannot be undone.
      </p>

      <div className="mt-4 flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100 transition cursor-pointer"
        >
          Cancel
        </button>

        <button
          disabled={loading}
          onClick={handleDelete}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition cursor-pointer"
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}