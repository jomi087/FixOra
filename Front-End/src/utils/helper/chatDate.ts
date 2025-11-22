export const formatChatDate = (timestamp: Date | string): string => {
  const date = new Date(timestamp);
  const today = new Date();

  const isToday =
        date.toDateString() === today.toDateString();

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const isYesterday =
        date.toDateString() === yesterday.toDateString();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";

  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
