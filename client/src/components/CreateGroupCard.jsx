import { HiOutlinePlus } from "react-icons/hi2";

export default function CreateGroupCard({ onClick }) {
  return (
    <>
      <button onClick={onClick}
        className="bg-white rounded-xl border-2 border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 p-6 flex flex-col items-center justify-center gap-2 transition group cursor-pointer">
        <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-indigo-100 flex items-center justify-center text-gray-400 group-hover:text-indigo-500 text-xl transition">
          <HiOutlinePlus className="w-5 h-5" />
        </div>
        <p className="text-sm font-medium text-gray-500 group-hover:text-indigo-600 transition">
          Create New Group
        </p>
        <p className="text-xs text-gray-400">Start splitting with friends</p>
      </button>
    </>
  )
}