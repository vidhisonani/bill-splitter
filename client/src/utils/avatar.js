export const getInitials = (firstName, lastName) => {
  if (lastName) {
    return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
  }

  const parts = (firstName ?? "").trim().split(/\s+/);

  return parts.length > 1
    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    : (parts[0]?.[0] ?? "").toUpperCase();
};
export const avatarColors = [
  "bg-indigo-500", "bg-pink-500", "bg-emerald-500",
  "bg-amber-500", "bg-sky-500", "bg-violet-500"
];