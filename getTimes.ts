export default function getTimes(
  data: string,
): { hour: number; Messages: number }[] {
  // Type guard to ensure data is a string
  if (typeof data !== 'string') {
    console.error('Error: Expected string data but received buffer');
    return [{ hour: -1, Messages: 0 }];
  }

  // Remove all invisible characters
  const originalChat = data.replace(/‎/gm, '');

  // Strict regex to search for date
  const DATE_REGEX = /^\[\d{2}\/\d{2}\/\d{4}, (\d{2}):\d{2}:\d{2}\]\s/gm;

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

  // Convert the timeCounts object to an array of objects
  const timeArray = Object.entries(timeCounts).map(([hour, Messages]) => ({
    hour: parseInt(hour),
    Messages,
  }));

  // Check if the timeArray is empty
  if (timeArray.length !== 0) {
    return timeArray;
  } else {
    return [{ hour: -1, Messages: 0 }];
  }
}

function formatHour(hour: number): string {
  // Ensure the hour is within the valid range
  if (hour < 0 || hour > 23) {
    throw new Error('Hour must be between 0 and 23');
  }

  // Format the hour as HH:00 or 00:00 for 0 and 23 respectively
  const formattedHour = hour === 0 ? '00:00' : `${hour}:00`;

  return formattedHour;
}
