import { Link, useNavigate } from 'react-router-dom';
import { MdReceiptLong } from 'react-icons/md';
import { HiOutlineArrowLeft, HiOutlineHome } from 'react-icons/hi2';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">

      <Link to="/" className="flex items-center gap-2 mb-12 group">
        <div className="bg-indigo-600 text-white p-2 rounded-xl group-hover:bg-indigo-700 transition">
          <MdReceiptLong size={22} />
        </div>
        <span className="text-2xl font-extrabold text-indigo-600 tracking-tight group-hover:text-indigo-700 transition">
          SplitEase
        </span>
      </Link>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 max-w-md w-full text-center">
        <div className="relative mb-6 select-none">
          <p aria-hidden="true" className="text-[7rem] font-extrabold leading-none text-indigo-50 tracking-tighter">
            404
          </p>
          <p className="absolute inset-0 flex items-center justify-center text-[3rem] font-extrabold text-indigo-600 tracking-tight">
            404
          </p>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Page not found
        </h1>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          Looks like this page got lost in the split.
          <br />
          It doesn't exist or may have been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate("/dashboard");
              }
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition cursor-pointer"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            Go back
          </button>
          <Link
            to="/dashboard"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition"
          >
            <HiOutlineHome className="w-4 h-4" />
            Dashboard
          </Link>
        </div>
      </div>

      <p className="mt-8 text-xs text-gray-400">
        If you think this is a mistake,{' '}
        <Link to="/" className="text-indigo-500 hover:text-indigo-600 underline underline-offset-2">
          return home
        </Link>
      </p>
    </div>
  );
}
