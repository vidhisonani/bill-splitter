import { getInitials, avatarColors } from "../utils/avatar"
import { Link } from "react-router-dom";

export default function GroupDetailsCards({ groups = []}) {
  return (
    <>
      {groups?.map((group, index) => {
        const memberCount = group.members.length;
        return (
          <Link
            key={group._id}
            to={`/groups/${group._id}`}
            className="bg-white rounded-xl border border-gray-200 hover:shadow-md p-5 flex flex-col gap-4 transition"
          >
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-lg ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white text-sm font-bold`}>
                {getInitials(group.name)}
              </div>
              {group.userBalance > 0 ? (
                <span className="text-sm font-semibold text-emerald-500">+₹{group.userBalance.toFixed(2)}</span>
              ) : group.userBalance < 0 ? (
                <span className="text-sm font-semibold text-red-500">-₹{Math.abs(group.userBalance).toFixed(2)}</span>
              ) : (
                <span className="text-sm font-semibold text-gray-400">₹0.00</span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{group.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {memberCount} member{memberCount !== 1 ? "s" : ""}
              </p>
            </div>
            {/* Member avatars */}
            <div className="flex -space-x-2">
              {group.members.slice(0, 3).map((member, i) => (
                <div
                  key={member._id}
                  title={`${member.firstName} ${member.lastName}`}
                  className={`w-7 h-7 rounded-full ${avatarColors[i % avatarColors.length]} border-2 border-white flex items-center justify-center text-white text-xs font-medium`}
                >
                  {getInitials(member.firstName, member.lastName)}
                </div>
              ))}
              {memberCount > 3 && (
                <div className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-gray-500 text-xs font-medium">
                  +{memberCount - 3}
                </div>
              )}
            </div>
          </Link>
        )
      })}
    </>
  )
}