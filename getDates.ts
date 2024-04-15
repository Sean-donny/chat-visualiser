export default function getDates(
  data: string,
): Record<string, number> | Record<string, number> {
  // Type guard to ensure data is a string
  if (typeof data !== 'string') {
    console.error('Error: Expected string data but received buffer');
    return {};
  }

  // Remove all invisible characters
  const originalChat = data.replace(/‎/gm, '');

  // Strict regex to search for date
  const DATE_REGEX = /^\[\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2}\]\s/gm;

  // Object to store date counts
  const dateCounts: Record<string, number> = {};

  // Use match instead of split to extract parts by date
  const dates = originalChat.match(DATE_REGEX);

  // Loop to iterate through dates array and count date occurrences in the dateCounts object
  if (dates) {
    for (const date of dates) {
      // Extract date from matched string
      const currentDate = date.split(',')[0].replace('[', '');

      // Increment count for the current date
      dateCounts[currentDate] = (dateCounts[currentDate] || 0) + 1;
    }
  }

  if (Object.keys(dateCounts).length !== 0) {
    return dateCounts;
  } else {
    return { 'No Dates': 0 };
  }
}
