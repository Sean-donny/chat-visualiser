type DateFormat = 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy/mm/dd';
type TimeFormat = 'hh:mm:ss' | 'hh:mm:ss a';

export default function getMostActiveTimes(
  data: string,
  dateFormat: DateFormat,
  timeFormat: TimeFormat,
): { hour: number; Messages: number }[] {
  // Type guard to ensure data is a string
  if (typeof data !== 'string') {
    throw new Error('Expected string data but received ' + typeof data);
  }

  // Remove all invisible characters
  const originalChat = data.replace(/‎/gm, '');

  // Define regex patterns for different date and time formats
  const datePatterns: Record<DateFormat, string> = {
    'dd/mm/yyyy': '(\\d{2})/(\\d{2})/(\\d{4})', // Example: 07/01/2023
    'mm/dd/yyyy': '(\\d{2})/(\\d{2})/(\\d{4})', // Example: 01/07/2023
    'yyyy/mm/dd': '(\\d{4})/(\\d{2})/(\\d{2})', // Example: 2023/07/01
  };

  const timePatterns: Record<TimeFormat, string> = {
    'hh:mm:ss': '(\\d{1,2}):(\\d{2}):(\\d{2})', // Example: 14:10:45
    'hh:mm:ss a': '(\\d{1,2}):(\\d{2}):(\\d{2})[\\u202F\\s]([APap][Mm])', // Example: 2:10:45 PM
  };

  // Determine the date and time patterns based on the provided formats
  const datePattern = datePatterns[dateFormat];
  const timePattern = timePatterns[timeFormat];

  // Construct the full timestamp regex pattern for matching
  const TIMESTAMP_REGEX = new RegExp(
    `^\\[${datePattern},\\s${timePattern}\\]\\s`,
    'gm',
  );
  // Object to store date counts
  const timeCounts: Record<number, number> = {};

  // Use match to extract parts by date
  const dates = originalChat.match(TIMESTAMP_REGEX);

  // Handle the case where no dates are found
  if (!dates) {
    throw new Error('No dates found in the provided data');
  }

  // Loop to iterate through dates array and count date occurrences in the timeCounts object
  for (const date of dates) {
    const timeMatch = date.match(timePattern);
    if (!timeMatch) continue;

    let currentHour = 0;
    if (timeFormat === 'hh:mm:ss a') {
      const [, hour, , , period] = timeMatch;
      currentHour = parseInt(hour, 10);
      if (period.toLowerCase() === 'pm' && currentHour !== 12) {
        currentHour += 12;
      } else if (period.toLowerCase() === 'am' && currentHour === 12) {
        currentHour = 0;
      }
    } else {
      const [, hour] = timeMatch;
      currentHour = parseInt(hour, 10);
    }

    // Increment count for the current hour
    timeCounts[currentHour] = (timeCounts[currentHour] || 0) + 1;
  }

  // Sort most active times
  const activeTimesArray = Object.entries(timeCounts);

  // Sort the array based on the active times in descending order
  activeTimesArray.sort((a, b) => b[1] - a[1]);

  // Convert the sorted array to the desired format of array of objects
  const result = activeTimesArray.map(([hour, Messages]) => ({
    hour: parseInt(hour),
    Messages,
  }));

  return result;
}
