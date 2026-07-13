import { useState } from "react";
import api from "../api";
import { MdError } from "react-icons/md";
import toast from "react-hot-toast";

export default function CreateGroupModal({ show, onClose, onGroupCreated }) {
  const [groupForm, setGroupForm] = useState({ name: "", description: "" });
  const [groupError, setGroupError] = useState("");
  const [creating, setCreating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGroupForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setGroupForm({ name: "", description: "" });
    setGroupError("");
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setGroupError("");
    if (!groupForm.name.trim()) {
      setGroupError("Group name is required");
      return;
    }
    setCreating(true);
    const payload = {
      ...groupForm,
      name: groupForm.name.trim(),
      description: groupForm.description.trim() || ""
    };

    try {
      const response = await api.post("/groups", payload);
      onGroupCreated(response.data.group);
      resetForm();
      onClose();
      toast.success("Group created successfully");
    } catch (err) {
      const message = err?.response?.data?.message || "Something went wrong";
      setGroupError(message);
    } finally {
      setCreating(false);
    }
  };
  if (!show) return null;
  return (
    <>
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
                name="name"
                type="text"
                required
                autoFocus
                disabled={creating}
                value={groupForm.name}
                onChange={handleChange}
                placeholder="e.g. Goa Trip, Flat 4B"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                name="description"
                rows={3}
                disabled={creating}
                value={groupForm.description}
                onChange={handleChange}
                placeholder="e.g. March trip expenses"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                disabled={creating}
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? "Creating..." : "Create Group"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}