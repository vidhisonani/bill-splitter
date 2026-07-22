import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { HiOutlineArrowUpRight, HiOutlineArrowDownLeft, HiOutlineExclamationTriangle } from 'react-icons/hi2';
import CreateGroupModal from '../components/CreateGroupModal';
import useGroups from '../hooks/useGroups';
import CreateGroupCard from '../components/CreateGroupCard';
import GroupDetailsCards from '../components/GroupsDetailsCards';
import useDocumentTitle from '../hooks/useDocumentTitle';
import DashboardSkeleton from "../components/skeletons/DashboardSkeleton";

function Dashboard() {
  useDocumentTitle("Dashboard | SplitEase");

  const { groups, setGroups, loading, error } = useGroups();
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  const { totalOwed, totalOwe } = useMemo(() => {
    let totalOwed = 0;
    let totalOwe = 0;
    groups.forEach(group => {
      const bal = group.userBalance ?? 0;
      if (bal > 0) {
        totalOwed += bal;
      } else if (bal < 0) {
        totalOwe += Math.abs(bal);
      }
    });
    return { totalOwed, totalOwe };
  }, [groups]);

  const handleGroupCreated = useCallback((group) => {
    setGroups(prev => [...prev, group]);
  }, [setGroups]);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main  */}
      <main className="md:ml-56 flex-1 px-4 md:px-8 pt-24 pb-24 md:py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.firstName || "there"}!
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Here is a summary of your shared expenses.
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 mb-4">
            <HiOutlineExclamationTriangle size={18} className="shrink-0" />
            {error}
          </div>
        )}
        {/* Balance  */}
        {!error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total owed to you</p>
                <p className="text-2xl font-bold text-emerald-500">+₹{totalOwed.toFixed(2)}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500">
                <HiOutlineArrowUpRight className="w-5 h-5" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total you owe</p>
                <p className="text-2xl font-bold text-red-500">-₹{totalOwe.toFixed(2)}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                <HiOutlineArrowDownLeft className="w-5 h-5" />
              </div>
            </div>
          </div>
        )}

        {/* Groups  */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Your Groups</h2>
          <Link to="/groups" className="text-sm text-indigo-600 hover:text-indigo-700">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Create new group card */}
          <CreateGroupCard onClick={() => setShowModal(true)} />
          {/* Create Group Modal */}
          <CreateGroupModal show={showModal} onClose={() => setShowModal(false)} onGroupCreated={handleGroupCreated} />

          {/* Group cards */}
          <GroupDetailsCards groups={groups.slice(0, 3)} />
        </div>
      </main >
    </div >
  );
}

export default Dashboard;