export default function getTimes(data) {
  // Type guard to ensure data is a string
  if (typeof data !== 'string') {
    console.error('Error: Expected string data but received buffer');
    return;
  }

  // Remove all invisible characters
  const originalChat = data.replace(/‎/gm, '');

  // Strict regex to search for date
  const DATE_REGEX = /^\[\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2}\]\s/gm;

  // Object to store date counts
  const timeCounts = {};

  // Initialize object with keys from "00" to "23" and values as 0
  for (let i = 0; i <= 23; i++) {
    const key = i < 10 ? '0' + i : '' + i;
    timeCounts[key] = 0;
  }

  // Use match instead of split to extract parts by date
  const dates = originalChat.match(DATE_REGEX);

  // Process dates and update counts
  for (const date of dates) {
    // Extract time from matched string
    const currentTime = date.split(',')[1].replace(']', '').trim().slice(0, 2);

    // Increment count for the current hour
    timeCounts[currentTime] = (timeCounts[currentTime] || 0) + 1;
  }

  // Ensure the output appears in order from "00" to "23"
  const timesArray = Object.entries(timeCounts).sort((a, b) =>
    a[0].localeCompare(b[0]),
  );

  return timesArray;
}
