import { format, isToday, isYesterday, isThisWeek } from "date-fns";

function formatMessageDate(dateString) {
    const date = new Date(dateString);
  const messageDate =    date.toISOString().slice(0, 19).replace('T', ' '); // Parse the date string
  const today = new Date();

  // Check if the date is today
  if (isToday(messageDate)) {
    return format(messageDate, "hh:mm a"); // Format as "10:30 AM"
  }

  // Check if the date is yesterday
  if (isYesterday(messageDate)) {
    return "Yesterday";
  }

  // Check if the date is within this week
  if (isThisWeek(messageDate, { weekStartsOn: 0 })) {
    return format(messageDate, "EEEE"); // Format as "Monday"
  }

  // Default to showing the date
  return format(messageDate, "MMM d, yyyy"); // Format as "Jan 10, 2025"
}

export default formatMessageDate;
