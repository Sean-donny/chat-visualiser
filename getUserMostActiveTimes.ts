interface HourlyActivity {
  Hour: number;
  [sender: string]: number;
}

type DateFormat = 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy/mm/dd';
type TimeFormat = 'hh:mm:ss' | 'hh:mm:ss a';

export default function getUserMostActiveTimes(
  data: string,
  dateFormat: DateFormat,
  timeFormat: TimeFormat,
): HourlyActivity[] | null {
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
    `\\[${datePattern},\\s${timePattern}\\]\\s([^:]+):`,
    'g',
  );

  // Store group chat name
  const gcName = extractGroupName(data, dateFormat, timeFormat);

  if (!gcName) {
    console.error('Error: Group chat name not found');
    return null;
  }

  // Object to store sender-hour counts
  const senderActiveTimes: Record<number, { [sender: string]: number }> = {};

  // Extract sender and hour from each timestamp and update senderActiveTimes
  let match;
  while ((match = TIMESTAMP_REGEX.exec(originalChat)) !== null) {
    let hour = 0;
    if (timeFormat === 'hh:mm:ss a') {
      const [, , , , rawHour, , , period] = match;
      hour = parseInt(rawHour, 10);
      if (period.toLowerCase() === 'pm' && hour !== 12) {
        hour += 12;
      } else if (period.toLowerCase() === 'am' && hour === 12) {
        hour = 0;
      }
    } else {
      const [, , , , rawHour] = match;
      hour = parseInt(rawHour, 10);
    }
    const sender = match[match.length - 1].trim(); // Extract the sender

    // Check that sender is not the group chat itself
    if (sender === gcName) continue;

    // Initialize an hour object containing the sender and their count in senderActiveTimes if not already present
    if (!senderActiveTimes[hour]) {
      senderActiveTimes[hour] = { [sender]: 0 };
    }

    // Increment the count for the corresponding sender in the hour
    senderActiveTimes[hour][sender] =
      (senderActiveTimes[hour][sender] || 0) + 1;
  }

  // Make Array of HourlyActivity objects
  const hourlyActivityArray: HourlyActivity[] = Object.entries(
    senderActiveTimes,
  ).map(([hour, activity]) => ({
    Hour: parseInt(hour),
    ...activity,
  }));

  return hourlyActivityArray;
}

function extractGroupName(
  data: string,
  dateFormat: DateFormat,
  timeFormat: TimeFormat,
): string | null {
  // Regex to search for group chat creation message
  const groupChatNameRegex =
    /Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them./;

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

  // Construct the full timestamp regex pattern for splitting
  const TIMESTAMP_REGEX = new RegExp(
    `^\\[${datePattern},\\s${timePattern}\\]\\s`,
    'gm',
  );

  // Store group chat name if found
  let gcName = 'Your Group Chat';

  // Split the chat by date to get the messages
  const chatMessages = originalChat.split(TIMESTAMP_REGEX).splice(1);

  for (const message of chatMessages) {
    if (message.match(groupChatNameRegex)) {
      gcName = message.split(':')[0].trim();
      break;
    }
  }

  // If group chat name is found, return it; otherwise, return null
  return gcName !== 'Your Group Chat' ? gcName : null;
}
