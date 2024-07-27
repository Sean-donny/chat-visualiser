type DateFormat = 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy/mm/dd';
type TimeFormat = 'hh:mm:ss' | 'hh:mm:ss a';

export default function getDates(
  data: string,
  dateFormat: DateFormat,
  timeFormat: TimeFormat,
): { date: string; Messages: number }[] {
  // Type guard to ensure data is a string
  if (typeof data !== 'string') {
    console.error('Error: Expected string data but received buffer');
    return [];
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
    'hh:mm:ss a': '(\\d{1,2}):(\\d{2}):(\\d{2})\\u202F[APap][Mm]', // Example: 2:10:45 PM
  };

  // Determine the date and time patterns based on the provided formats
  const datePattern = datePatterns[dateFormat];
  const timePattern = timePatterns[timeFormat];

  // Construct the full timestamp regex pattern for splitting
  const TIMESTAMP_REGEX = new RegExp(
    `^\\[${datePattern},\\s${timePattern}\\]\\s`,
    'gm',
  );

  // Construct the dynamic regex pattern to extract the date
  const DATE_REGEX = new RegExp(datePattern);

  // Object to store date counts
  const dateCounts: Record<string, number> = {};

  // Use match instead of split to extract parts by date
  const dates = originalChat.match(TIMESTAMP_REGEX);

  // Loop to iterate through dates array and count date occurrences in the dateCounts object
  if (dates) {
    for (const date of dates) {
      // Extract date from matched string
      const currentDate = date.split(',')[0].replace('[', '');
      const match = DATE_REGEX.exec(currentDate);
      let formattedDate = '';
      if (match !== null) {
        let Day, Month, Year;
        if (dateFormat === 'dd/mm/yyyy') {
          [, Day, Month, Year] = match;
        } else if (dateFormat === 'mm/dd/yyyy') {
          [, Month, Day, Year] = match;
        } else if (dateFormat === 'yyyy/mm/dd') {
          [, Year, Month, Day] = match;
        }

        Day = Day ?? '';
        Month = Month ?? '';
        Year = Year ?? '';

        formattedDate = `${Day} ${getMonthName(parseInt(Month))} ${Year}`;
      }

      // Increment count for the current date
      dateCounts[formattedDate] = (dateCounts[formattedDate] || 0) + 1;
    }
  }

  // Convert dateCounts object into an array of objects with date and count properties
  const dateArray = Object.entries(dateCounts).map(([date, Messages]) => ({
    date,
    Messages,
  }));

  if (dateArray.length !== 0) {
    return dateArray;
  } else {
    // Return an array with a single object indicating no dates found
    return [{ date: 'No Dates', Messages: 0 }];
  }
}

function getMonthName(monthNumber: number): string {
  switch (monthNumber) {
    case 1:
      return 'Jan';
    case 2:
      return 'Feb';
    case 3:
      return 'Mar';
    case 4:
      return 'Apr';
    case 5:
      return 'May';
    case 6:
      return 'Jun';
    case 7:
      return 'Jul';
    case 8:
      return 'Aug';
    case 9:
      return 'Sep';
    case 10:
      return 'Oct';
    case 11:
      return 'Nov';
    case 12:
      return 'Dec';
    default:
      return 'Invalid month number';
  }
}
