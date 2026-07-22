import Sidebar from "../Sidebar";

export default function ExpensesSkeleton() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="md:ml-56 flex-1 px-4 md:px-8 pt-24 pb-24 md:py-8">
        <div className="animate-pulse">
          {/* Heading */}
          <div className="mb-6">
            <div className="h-7 w-40 bg-gray-200 rounded-md" />
            <div className="h-4 w-72 max-w-full bg-gray-200 rounded-md mt-2" />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-xl border border-gray-200 p-4"
              >
                <div className="h-3 w-24 bg-gray-200 rounded mb-3" />
                <div className="h-6 w-28 bg-gray-200 rounded" />
              </div>
            ))}
          </div>

          {/* Search + Filters Skeleton */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            {/* Search */}
            <div className="w-full sm:flex-1 h-10 bg-gray-200 rounded-lg" />

            {/* Filter Buttons */}
            <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-2">
              <div className="h-10 w-full sm:w-14 bg-gray-200 rounded-lg" />
              <div className="h-10 w-full sm:w-20 bg-gray-200 rounded-lg" />
              <div className="h-10 w-full sm:w-20 bg-gray-200 rounded-lg" />
            </div>

            {/* Sort */}
            <div className="w-full sm:w-36 h-10 bg-gray-200 rounded-lg" />
          </div>

          {/* Expense List */}
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between"
              >
                {/* Left */}
                <div className="flex items-center gap-4 min-w-0">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-lg bg-gray-200 shrink-0" />

                  {/* Details */}
                  <div className="min-w-0">
                    {/* Title */}
                    <div className="h-4 w-36 bg-gray-200 rounded" />

                    {/* Group + Date */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="h-5 w-24 bg-gray-200 rounded-full" />
                      <div className="h-3 w-20 bg-gray-200 rounded" />
                    </div>

                    {/* Paid By */}
                    <div className="h-3 w-28 bg-gray-200 rounded mt-2" />
                  </div>
                </div>

                {/* Right */}
                <div className="flex flex-col items-end ml-3 shrink-0">
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                  <div className="h-3 w-28 bg-gray-200 rounded mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
