import Sidebar from "../components/Sidebar";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import { useState, useCallback } from "react";
import CreateGroupModal from '../components/CreateGroupModal';
import CreateGroupCard from "../components/CreateGroupCard";
import useGroups from '../hooks/useGroups';
import GroupDetailsCards from '../components/GroupsDetailsCards';
import useDocumentTitle from "../hooks/useDocumentTitle";
import GroupSkeleton from "../components/skeletons/GroupsSkeleton";

export default function Groups() {
  useDocumentTitle("Groups | SplitEase");

  const { groups, setGroups, loading, error } = useGroups();
  const [showModal, setShowModal] = useState(false);

  const handleGroupCreated = useCallback((group) => {
    setGroups(prev => [...prev, group]);
  }, [setGroups]);

  if (loading) return <GroupSkeleton />

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="md:ml-56 flex-1 px-4 md:px-8 pt-24 pb-24 md:py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              All Groups
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              All your groups in one place.
            </p>
          </div>
        </div>
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <HiOutlineExclamationTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Create new group card */}
          <CreateGroupCard onClick={() => setShowModal(true)} />
          {/* Create Group Modal */}
          <CreateGroupModal show={showModal} onClose={() => setShowModal(false)} onGroupCreated={handleGroupCreated} />
          {/* groups cards */}
          <GroupDetailsCards groups={groups} />
        </div>
      </main>
    </div>
  );
}   