import { HiOutlineUserPlus } from "react-icons/hi2";
import { MdError } from "react-icons/md";
import { useEffect, useMemo, useState } from "react";
import api from "../api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function AddMemberCard({
  id,
  fetchGroupAndExpenses,
  groupMembers = [],
}) {
  const { user } = useAuth();
  const [memberEmail, setMemberEmail] = useState("");
  const [memberError, setMemberError] = useState("");
  const [memberLoading, setMemberLoading] = useState(false);
  const [friends, setFriends] = useState([]);
  const [friendsLoading, setFriendsLoading] = useState(false);
  const [friendsLoaded, setFriendsLoaded] = useState(false);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!user?._id) return;
      setFriendsLoading(true);
      try {
        const res = await api.get("/friends");
        const myId = user._id.toString();
        const friendMap = new Map();

        (res.data || []).forEach((request) => {
          const sender = request?.sender;
          const receiver = request?.receiver;

          if (!sender?._id || !receiver?._id) return;

          const friend = sender._id.toString() === myId ? receiver : sender;

          if (friend?.email) {
            friendMap.set(friend._id.toString(), {
              _id: friend._id.toString(),
              name: `${friend.firstName || ""} ${friend.lastName || ""}`.trim(),
              email: friend.email,
            });
          }
        });

        setFriends(Array.from(friendMap.values()));
      } catch (_err) {
        setFriends([]);
      } finally {
        setFriendsLoading(false);
        setFriendsLoaded(true);
      }
    };

    fetchFriends();
  }, [user?._id]);

  const existingMemberEmails = useMemo(
    () =>
      new Set(
        groupMembers
          .map((member) => member?.email?.toLowerCase())
          .filter(Boolean)
      ),
    [groupMembers]
  );

  const availableFriends = useMemo(
    () =>
      friends.filter(
        (friend) => !existingMemberEmails.has(friend.email.toLowerCase())
      ),
    [friends, existingMemberEmails]
  );

  const filteredSuggestions = useMemo(() => {
    const query = memberEmail.trim().toLowerCase();
    if (!query) return availableFriends.slice(0, 5);

    return availableFriends
      .filter(
        (friend) =>
          friend.email.toLowerCase().includes(query) ||
          friend.name.toLowerCase().includes(query)
      )
      .slice(0, 5);
  }, [availableFriends, memberEmail]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    setMemberError("");
    const email = memberEmail.trim().toLowerCase();
    if (!email) {
      setMemberError("Please enter email address.");
      return;
    }

    if (
      friendsLoaded &&
      !friendsLoading &&
      !availableFriends.some((friend) => friend.email.toLowerCase() === email)
    ) {
      setMemberError("Select a valid friend from suggestions.");
      return;
    }

    setMemberLoading(true);
    try {
      await api.post(`/groups/${id}/members`, { email });
      toast.success("Member added successfully");
      setMemberEmail("");
      await fetchGroupAndExpenses();
    } catch (err) {
      if (err.response?.data?.errors) {
        setMemberError(err.response.data.errors[0].msg);
      } else {
        setMemberError(err.response?.data?.message || "Something went wrong");
      }
    } finally {
      setMemberLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <HiOutlineUserPlus className="w-4 h-4" /> Add Member
        </h2>
        {memberError && (
          <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg border border-red-200 text-sm text-red-600 mb-3">
            <MdError size={16} />
            <p>{memberError}</p>
          </div>
        )}
        <form onSubmit={handleAddMember} className="space-y-3">
          <input
            type="email"
            list={`friends-suggestions-${id}`}
            value={memberEmail}
            onChange={(e) => {
              setMemberEmail(e.target.value);
              if (memberError) setMemberError("");
            }}
            placeholder="friend@example.com"
            required
            disabled={memberLoading}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
          <datalist id={`friends-suggestions-${id}`}>
            {availableFriends.map((friend) => (
              <option key={friend._id} value={friend.email}>
                {friend.name}
              </option>
            ))}
          </datalist>

          {!friendsLoading && filteredSuggestions.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {filteredSuggestions.map((friend) => (
                <button
                  key={friend._id}
                  type="button"
                  onClick={() => {
                    setMemberEmail(friend.email);
                    if (memberError) setMemberError("");
                  }}
                  className="text-xs px-2.5 py-1 rounded-full border border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition cursor-pointer"
                >
                  {friend.name || friend.email}
                </button>
              ))}
            </div>
          )}

          {!friendsLoading &&
            friendsLoaded &&
            availableFriends.length === 0 && (
              <p className="text-xs text-gray-400">
                No eligible friends to add right now.
              </p>
            )}

          <button
            type="submit"
            disabled={memberLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-medium py-2 rounded-lg transition cursor-pointer"
          >
            {memberLoading ? "Adding..." : "Add Member"}
          </button>
        </form>
      </div>
    </>
  );
}
