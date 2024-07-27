type DateFormat = 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy/mm/dd';
type TimeFormat = 'hh:mm:ss' | 'hh:mm:ss a';

export default function getGroupName(
  data: string,
  dateFormat: DateFormat,
  timeFormat: TimeFormat,
): string {
  // Type guard to ensure data is a string
  if (typeof data === 'string') {
    // Regex to search for group chat creation message
    const groupChatNameRegex =
      /Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them./;

    // Remove all invisible characters
    const originalChat = data.replace(/‎/gm, '');

    // Define regex patterns for different date and time formats
    const datePatterns: Record<DateFormat, string> = {
      'dd/mm/yyyy': '\\d{2}/\\d{2}/\\d{4}', // Example: 07/01/2023
      'mm/dd/yyyy': '\\d{2}/\\d{2}/\\d{4}', // Example: 01/07/2023
      'yyyy/mm/dd': '\\d{4}/\\d{2}/\\d{2}', // Example: 2023/07/01
    };

    const timePatterns: Record<TimeFormat, string> = {
      'hh:mm:ss': '\\d{2}:\\d{2}:\\d{2}', // Example: 14:10:45
      'hh:mm:ss a': `\\d{1,2}:\\d{2}:\\d{2}\u202F[APap][Mm]`, // Example: 2:10:45 PM (with non-breaking space)
    };

    // Determine the date and time patterns based on the provided formats
    const datePattern = datePatterns[dateFormat];
    const timePattern = timePatterns[timeFormat];

    // Construct the full timestamp regex pattern, including the square brackets and whitespace
    const TIMESTAMP_REGEX = new RegExp(
      `^\\[${datePattern}, ${timePattern}\\]\\s`,
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

    // If group chat name is found, return it; otherwise, return a default message
    return gcName;
  } else {
    console.error('Error: Expected string data but received buffer');
    return 'Your Group Chat';
  }
}
