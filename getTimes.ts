type DateFormat = 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy/mm/dd';
type TimeFormat = 'hh:mm:ss' | 'hh:mm:ss a';

export default function getTimes(
  data: string,
  dateFormat: DateFormat,
  timeFormat: TimeFormat,
): { hour: string; Messages: number }[] {
  // Type guard to ensure data is a string
  if (typeof data !== 'string') {
    console.error('Error: Expected string data but received buffer');
    return [{ hour: '-1', Messages: 0 }];
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

  // Object to store time counts
  const timeCounts: Record<string, number> = {};

  // Use match instead of split to extract parts by date
  const dates = originalChat.match(TIMESTAMP_REGEX);

  // Process dates and update counts
  if (dates) {
    for (const date of dates) {
      // Extract time from matched string
      const timeMatch = new RegExp(timePattern).exec(date);
      if (timeMatch) {
        let hour: string | number = timeMatch[1] ?? '';
        const minute = timeMatch[2] ?? '';
        const second = timeMatch[3] ?? '';
        let amPm = '';

        // Adjust for 12-hour format if necessary
        if (timeFormat === 'hh:mm:ss a') {
          amPm = timeMatch[4] ?? '';
          hour = convertTo24HourFormat(hour, amPm);
        } else {
          hour = parseInt(hour, 10).toString(); // Convert hour to number and then back to string to remove leading zero
        }

        // Increment count for the current hour
        timeCounts[hour] = (timeCounts[hour] || 0) + 1;
      }
    }
  }

  // Convert the timeCounts object to an array of objects
  const timeArray = Object.entries(timeCounts).map(([hour, Messages]) => ({
    hour,
    Messages,
  }));

  // Sort the array to ensure proper order of times
  timeArray.sort((a, b) => parseInt(a.hour) - parseInt(b.hour));

  // Check if the timeArray is empty
  if (timeArray.length !== 0) {
    return timeArray;
  } else {
    return [{ hour: '-1', Messages: 0 }];
  }
}

// Function to convert 12-hour format to 24-hour format
function convertTo24HourFormat(hour: string, amPm: string): string {
  let newHour = parseInt(hour, 10);
  if (amPm.toUpperCase() === 'PM' && newHour < 12) {
    newHour += 12;
  } else if (amPm.toUpperCase() === 'AM' && newHour === 12) {
    newHour = 0;
  }
  return newHour.toString(); // Return hour without leading zeros
}
