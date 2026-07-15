import { getInitials, avatarColors } from "../utils/avatar"
import {useAuth} from '../context/AuthContext'

export default function MembersCard({ members = [] }) {
  // members detail on GroupDetail page

  const { user } = useAuth();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">
        Members ({members.length})
      </h2>
      <div className="space-y-3">
        {members.map((member, i) => (
          <div key={member._id} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-xs font-medium`}>
              {getInitials(member.firstName, member.lastName)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {member._id === user._id ? "You" : member.firstName + " " + member.lastName}
              </p>
              <p className="text-xs text-gray-400">{member.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}