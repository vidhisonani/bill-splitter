import { MdReceiptLong } from "react-icons/md";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-indigo-600 text-white p-3 rounded-xl">
          <MdReceiptLong size={28} />
        </div>
        <span className="text-3xl font-bold text-indigo-600">
          SplitEase
        </span>
      </div>

      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>

      <p className="mt-4 text-gray-500 text-sm">
        Loading...
      </p>
    </div>
  );
}