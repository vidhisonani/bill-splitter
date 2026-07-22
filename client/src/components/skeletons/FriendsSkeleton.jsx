import Sidebar from "../Sidebar";

export default function FriendsSkeleton() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="md:ml-56 flex-1 px-4 md:px-8 pt-24 pb-24 md:py-8">
        <div className="animate-pulse">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 gap-4">
            <div>
              <div className="h-7 w-56 bg-gray-200 rounded-md" />
              <div className="h-4 w-32 bg-gray-200 rounded mt-2" />
            </div>

            {/* Add Friend Button */}
            <div className="h-10 w-28 bg-gray-200 rounded-lg shrink-0" />
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between"
              >
                <div>
                  {/* Label */}
                  <div className="h-3 w-32 bg-gray-200 rounded mb-3" />

                  {/* Amount */}
                  <div className="h-7 w-28 bg-gray-200 rounded" />
                </div>

                {/* Icon */}
                <div className="w-10 h-10 rounded-full bg-gray-200" />
              </div>
            ))}
          </div>

          {/* Friend Requests */}
          <div>
            {/* Section Title */}
            <div className="h-6 w-36 bg-gray-200 rounded mb-3" />

            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
              {/* Tabs */}
              <div className="flex gap-4 border-b border-gray-200 mb-4">
                <div className="h-7 w-20 bg-gray-200 rounded" />
                <div className="h-7 w-16 bg-gray-200 rounded" />
              </div>

              {/* Request Items */}
              <div className="space-y-3">
                {[1, 2].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-100 gap-4"
                  >
                    {/* Request User */}
                    <div className="min-w-0">
                      <div className="h-4 w-32 bg-gray-200 rounded" />
                      <div className="h-3 w-44 bg-gray-200 rounded mt-2" />
                      <div className="h-3 w-36 bg-gray-200 rounded mt-2" />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2 shrink-0">
                      <div className="h-8 w-16 bg-gray-200 rounded-lg" />
                      <div className="h-8 w-16 bg-gray-200 rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Friends List */}
          <div>
            {/* Heading */}
            <div className="h-6 w-32 bg-gray-200 rounded mb-4" />

            {/* Friend Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-xl border border-gray-200 p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Friend Info */}
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />

                      <div className="min-w-0">
                        {/* Name */}
                        <div className="h-4 w-32 bg-gray-200 rounded" />

                        {/* Email */}
                        <div className="h-3 w-40 bg-gray-200 rounded mt-2" />
                      </div>
                    </div>

                    {/* Balance */}
                    <div className="flex flex-col items-end shrink-0">
                      <div className="h-3 w-20 bg-gray-200 rounded" />
                      <div className="h-4 w-20 bg-gray-200 rounded mt-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
