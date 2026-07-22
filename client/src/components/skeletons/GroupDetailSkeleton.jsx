import Sidebar from "../Sidebar";

export default function GroupDetailSkeleton() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="md:ml-56 flex-1 px-4 md:px-8 pt-24 pb-24 md:py-8">
        <div className="animate-pulse">
          {/* Back button */}
          <div className="h-4 w-16 bg-gray-200 rounded mb-6" />

          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="space-y-2">
              <div className="h-8 w-40 bg-gray-200 rounded-lg" />
              <div className="h-4 w-32 bg-gray-200 rounded" />
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded-lg" />
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 p-5"
              >
                <div className="h-3 w-28 bg-gray-200 rounded mb-3" />
                <div className="h-6 w-20 bg-gray-200 rounded" />
              </div>
            ))}
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Right — tabs (order-1 on mobile) */}
            <div className="col-span-1 md:col-span-2 md:order-2 order-1">
              <div className="bg-white rounded-xl border border-gray-200">
                {/* Tab headers */}
                <div className="flex gap-4 border-b border-gray-200 px-5">
                  <div className="h-10 w-20 bg-gray-200 rounded my-2" />
                  <div className="h-10 w-20 bg-gray-200 rounded my-2" />
                </div>
                {/* Expense items */}
                <div className="p-5 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-gray-200 rounded" />
                          <div className="h-3 w-24 bg-gray-200 rounded" />
                        </div>
                      </div>
                      <div className="space-y-1 text-right">
                        <div className="h-4 w-20 bg-gray-200 rounded" />
                        <div className="h-3 w-16 bg-gray-200 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Left — members (order-2 on mobile) */}
            <div className="col-span-1 md:order-1 order-2 space-y-4">
              {/* Members card */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full" />
                      <div className="space-y-1">
                        <div className="h-3 w-24 bg-gray-200 rounded" />
                        <div className="h-2.5 w-32 bg-gray-200 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add member card */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
                <div className="h-10 w-full bg-gray-200 rounded-lg mb-3" />
                <div className="h-10 w-full bg-gray-200 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
