import { HiOutlineUserPlus } from "react-icons/hi2";
import { MdError } from "react-icons/md";
import { useState } from "react";
import api from "../api";
import toast from "react-hot-toast";

export default function AddMemberCard({ id, fetchGroupAndExpenses }) {
  const [memberEmail, setMemberEmail] = useState("");
  const [memberError, setMemberError] = useState("");
  const [memberLoading, setMemberLoading] = useState(false);

  const handleAddMember = async (e) => {
    e.preventDefault();
    setMemberError("");
    const email = memberEmail.trim();
    if (!email) {
      setMemberError("Please enter email address.");
      return;
    }
    setMemberLoading(true);
    try {
      await api.post(`/groups/${id}/members`, { email });
      toast.success("Member added successfully");
      setMemberEmail("");
      await fetchGroupAndExpenses();
    } catch (err) {
      setMemberError(err?.response?.data?.message || "Failed to add member");
    } finally {
      setMemberLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <HiOutlineUserPlus className="w-4 h-4" /> Add Member
        </h2>
        {memberError && (
          <div className='flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg border border-red-200 text-sm text-red-600 mb-3'>
            <MdError size={16} />
            <p>{memberError}</p>
          </div>
        )}
        <form onSubmit={handleAddMember} className="space-y-3">
          <input
            type="email"
            value={memberEmail}
            onChange={(e) => {
              setMemberEmail(e.target.value);
              if (memberError) setMemberError("");
            }}
            placeholder="friend@example.com"
            required
            disabled={memberLoading}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
          <button
            type="submit"
            disabled={memberLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-medium py-2 rounded-lg transition cursor-pointer"
          >
            {memberLoading ? "Adding..." : "Add Member"}
          </button>
        </form>
      </div>
    </>
  )
}