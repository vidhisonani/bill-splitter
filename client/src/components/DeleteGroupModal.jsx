import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { HiOutlineTrash } from 'react-icons/hi2';
import toast from "react-hot-toast";

export default function DeleteGroupModal({ id, group }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteGroup = async () => {
    setLoading(true);
    try {
      await api.delete(`/groups/${id}`);
      toast.success("Group deleted");
      navigate("/groups");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete group.");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  }

  return (
    <>
      {group.createdBy._id === user._id && (
        <div className='bg-white rounded-xl border border-gray-200 p-5'>
          <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <HiOutlineTrash className='w-5 h-5' /> Want to delete this group?
          </h2>
          <p className='text-xs text-red-500 mb-3'>Warning: All the data will be lost.</p>
          <button
            disabled={loading}
            className='bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 rounded-lg transition w-full cursor-pointer'
            onClick={() => setShowDeleteModal(true)}>
            Delete Group
          </button>
        </div>
      )}
      {showDeleteModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className="bg-white p-6 rounded-lg w-72 sm:w-80">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
              <HiOutlineTrash className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold mb-3"> Delete Group? </h2>
            <p className="text-gray-600 mb-4">This action cannot be undone. All expenses, balances, and members will be permanently deleted.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 border rounded cursor-pointer" > Cancel </button>
              <button onClick={handleDeleteGroup} className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer hover:bg-red-700 transition" > Delete </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}