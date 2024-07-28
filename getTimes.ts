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
          hour = `${hour}${amPm.toLowerCase()}`;
        }

        // Ensure hour is stored correctly
        const timeKey =
          timeFormat === 'hh:mm:ss a' ? hour : parseInt(hour, 10).toString();

        // Increment count for the current hour
        timeCounts[timeKey] = (timeCounts[timeKey] || 0) + 1;
      }
    }
  }

  // Convert the timeCounts object to an array of objects
  const timeArray = Object.entries(timeCounts).map(([hour, Messages]) => ({
    hour,
    Messages,
  }));

  // Sort the array to ensure proper order of times
  if (timeFormat === 'hh:mm:ss a') {
    timeArray.sort((a, b) => {
      const timeA = a.hour.match(/(\d+)(am|pm)/i);
      const timeB = b.hour.match(/(\d+)(am|pm)/i);
      if (timeA && timeB) {
        const [hourA, periodA] = timeA.slice(1);
        const [hourB, periodB] = timeB.slice(1);
        const periodOrder = ['am', 'pm'];
        if (periodA.toLowerCase() !== periodB.toLowerCase()) {
          return (
            periodOrder.indexOf(periodA.toLowerCase()) -
            periodOrder.indexOf(periodB.toLowerCase())
          );
        }
        return parseInt(hourA) - parseInt(hourB);
      }
      return 0;
    });
  } else {
    timeArray.sort((a, b) => parseInt(a.hour) - parseInt(b.hour));
  }

  // Check if the timeArray is empty
  if (timeArray.length !== 0) {
    return timeArray;
  } else {
    return [{ hour: '-1', Messages: 0 }];
  }
}
