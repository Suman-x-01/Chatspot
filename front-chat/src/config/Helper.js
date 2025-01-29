export function formatTime(timestamp) {
  if (!timestamp) return "Invalid Time";

  try {
    const date = new Date(timestamp);

    // Validate the date
    if (isNaN(date.getTime())) {
      console.error("Invalid Date:", timestamp); // Log the problematic timestamp
      return "Invalid Time";
    }

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  } catch (error) {
    console.error("Error formatting timestamp:", error, timestamp);
    return "Invalid Time";
  }
}
