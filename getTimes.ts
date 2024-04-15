export default function getTimes(
  data: string,
): Record<number, number> | { 'No Times': 0 } {
  // Type guard to ensure data is a string
  if (typeof data !== 'string') {
    console.error('Error: Expected string data but received buffer');
    return { 'No Times': 0 };
  }

  // Remove all invisible characters
  const originalChat = data.replace(/‎/gm, '');

  // Strict regex to search for date
  const DATE_REGEX = /^\[\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2}\]\s/gm;

  // Object to store time counts
  const timeCounts: Record<number, number> = {};

  // Initialize object with keys from 0 to 23 and values as 0
  for (let i = 0; i <= 23; i++) {
    timeCounts[i] = 0;
  }

  // Use match instead of split to extract parts by date
  const dates = originalChat.match(DATE_REGEX);

  // Process dates and update counts
  if (dates) {
    for (const date of dates) {
      // Extract time from matched string
      const currentTime = date
        .split(',')[1]
        .replace(']', '')
        .trim()
        .slice(0, 2);

      // Convert time to number
      const hour = parseInt(currentTime, 10);

      // Increment count for the current hour
      timeCounts[hour] = (timeCounts[hour] || 0) + 1;
    }
  }

  if (Object.keys(timeCounts).length !== 0) {
    return timeCounts;
  } else {
    return { 'No Times': 0 };
  }
}
