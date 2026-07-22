import Sidebar from "../Sidebar";

export default function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="md:ml-56 flex-1 px-4 md:px-8 pt-24 pb-24 md:py-8">
        <div className="animate-pulse">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-gray-200 rounded-lg" />
              <div className="h-4 w-64 bg-gray-200 rounded-lg" />
            </div>
          </div>

          {/* Balance cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex justify-between items-center">
              <div className="">
                <div className="h-3 w-32 bg-gray-200 rounded mb-3" />
                <div className="h-8 w-24 bg-gray-200 rounded" />
              </div>
              <div className="bg-gray-200 w-10 h-10 rounded-full" />
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex justify-between items-center">
              <div className="">
                <div className="h-3 w-32 bg-gray-200 rounded mb-3" />
                <div className="h-8 w-24 bg-gray-200 rounded" />
              </div>
              <div className="bg-gray-200 w-10 h-10 rounded-full" />
            </div>
          </div>

          {/* Groups header */}
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 w-32 bg-gray-200 rounded" />
            <div className="h-4 w-16 bg-gray-200 rounded" />
          </div>

          {/* Group cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Create card placeholder */}
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-6 flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="h-4 w-28 bg-gray-200 rounded" />
              <div className="h-3 w-36 bg-gray-200 rounded" />
            </div>

            {/* Group card placeholders */}
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-5 w-28 bg-gray-200 rounded" />
                  <div className="h-3 w-20 bg-gray-200 rounded" />
                </div>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((j) => (
                    <div
                      key={j}
                      className="w-7 h-7 bg-gray-200 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
