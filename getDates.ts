export default function getDates(
  data: string,
): { date: string; Messages: number }[] {
  // Type guard to ensure data is a string
  if (typeof data !== 'string') {
    console.error('Error: Expected string data but received buffer');
    return [];
  }

  // Remove all invisible characters
  const originalChat = data.replace(/‎/gm, '');

  // Strict regex to search for date
  const DATE_REGEX = /^\[\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2}\]\s/gm;

  // Strict regex to extract DD/MM/YYYY
  const DDMMYYY_REGEX = /(\d{2})\/(\d{2})\/(\d{4})/;
  DDMMYYY_REGEX.lastIndex = 0; // Reset lastIndex

  // Object to store date counts
  const dateCounts: Record<string, number> = {};

  // Use match instead of split to extract parts by date
  const dates = originalChat.match(DATE_REGEX);

  // Loop to iterate through dates array and count date occurrences in the dateCounts object
  if (dates) {
    for (const date of dates) {
      // Extract date from matched string
      const currentDate = date.split(',')[0].replace('[', '');
      const match = DDMMYYY_REGEX.exec(currentDate);
      let formattedDate = '';
      if (match !== null) {
        const [, Day, Month, Year] = match; // Use destructuring to skip the first element (full match)
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
