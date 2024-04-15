export default function getMostActiveTimes(
  data: string,
): [number, number][] | [[number, number]] {
  // Type guard to ensure data is a string
  if (typeof data !== 'string') {
    throw new Error('Expected string data but received ' + typeof data);
  }

  // Remove all invisible characters
  const originalChat = data.replace(/‎/gm, '');

  // Strict regex to search for date
  const DATE_REGEX = /^\[\d{2}\/\d{2}\/\d{4}, (\d{2}):\d{2}:\d{2}\]\s/gm;

  // Object to store date counts
  const timeCounts: Record<number, number> = {};

  // Use match instead of split to extract parts by date
  const dates = originalChat.match(DATE_REGEX);

  // Handle the case where no dates are found
  if (!dates) {
    throw new Error('No dates found in the provided data');
  }

  // Loop to iterate through dates array and count date occurrences in the timeCounts object
  for (const date of dates) {
    // Extract hour from matched string and parse it as a number
    const currentHour = parseInt(
      date.split(',')[1].replace(']', '').trim().slice(0, 2),
      10,
    );

    // Increment count for the current hour
    timeCounts[currentHour] = (timeCounts[currentHour] || 0) + 1;
  }

  // Sort most active times
  const activeTimesArray = Object.entries(timeCounts);

  // Sort the array based on the active times in descending order
  activeTimesArray.sort((a, b) => b[1] - a[1]);

  // Return the array of most active times
  return activeTimesArray.length !== 0
    ? activeTimesArray.map(([hour, count]) => [parseInt(hour), count])
    : [[0, 0]];
}
