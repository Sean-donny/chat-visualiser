type MessageEntry = {
  Day: string;
  Month: string;
  Year: string;
  Hour: string;
  Minute: string;
  Second: string;
  Author: string;
  Message: string;
};

type DateFormat = 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy/mm/dd';
type TimeFormat = 'hh:mm:ss' | 'hh:mm:ss a';

export default function getGroupData(
  data: string,
  dateFormat: DateFormat,
  timeFormat: TimeFormat,
): MessageEntry[] | void {
  // Type guard to ensure data is a string
  if (typeof data !== 'string') {
    console.error('Error: Expected string data but received buffer');
    return;
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

  // Construct the full timestamp regex pattern for splitting
  const SPLIT_REGEX = new RegExp(
    `(?=\\[${datePattern},\\s${timePattern}\\])`,
    'm',
  );

  // Construct the full message regex pattern for capturing message details
  const MESSAGE_REGEX = new RegExp(
    `\\[${datePattern},\\s${timePattern}\\]\\s(.+?):\\s([\\s\\S]*)`,
    'm',
  );

  const CALL_REGEX = /(?:Voice\scall|Video\scall),.+\d\s(?:sec|min|hr)/;

  // Split the chat by timestamps to get the individual messages
  const chatMessages = originalChat.split(SPLIT_REGEX).filter(Boolean);

  // Store group chat name
  const gcName = extractGroupName(data, dateFormat, timeFormat);

  // Array to store group member messages as objects
  const groupMemberMessages: MessageEntry[] = [];

  // Loop to iterate through messages and generate message entry object
  for (const line of chatMessages) {
    const match = MESSAGE_REGEX.exec(line);

    if (match !== null) {
      let Day, Month, Year, Hour, Minute, Second, AmPm, Author, Message;
      if (dateFormat === 'dd/mm/yyyy') {
        if (timeFormat === 'hh:mm:ss a') {
          [, Day, Month, Year, Hour, Minute, Second, AmPm, Author, Message] =
            match;
          Hour = convertTo24HourFormat(Hour, AmPm);
        } else {
          [, Day, Month, Year, Hour, Minute, Second, Author, Message] = match;
        }
      } else if (dateFormat === 'mm/dd/yyyy') {
        if (timeFormat === 'hh:mm:ss a') {
          [, Month, Day, Year, Hour, Minute, Second, AmPm, Author, Message] =
            match;
          Hour = convertTo24HourFormat(Hour, AmPm);
        } else {
          [, Month, Day, Year, Hour, Minute, Second, Author, Message] = match;
        }
      } else if (dateFormat === 'yyyy/mm/dd') {
        if (timeFormat === 'hh:mm:ss a') {
          [, Year, Month, Day, Hour, Minute, Second, AmPm, Author, Message] =
            match;
          Hour = convertTo24HourFormat(Hour, AmPm);
        } else {
          [, Year, Month, Day, Hour, Minute, Second, Author, Message] = match;
        }
      }

      // Ensure Message entry is not undefined
      if (
        Day &&
        Month &&
        Year &&
        Hour &&
        Minute &&
        Second &&
        Author &&
        Message
      ) {
        // Perform checks against irrelevant chat data

        // Check that message is not from the group itself
        if (gcName !== null && Author.includes(gcName)) continue;

        // Special check if "You" messages are present
        if (Author === 'You') continue;

        // Check that message is not an attachment
        if (
          Message.includes('audio omitted') ||
          Message.includes('video omitted') ||
          Message.includes('image omitted') ||
          Message.includes('GIF omitted') ||
          Message.includes('Contact card omitted') ||
          Message.includes('document omitted') ||
          Message.includes('Location: https://maps.google.com/') ||
          Message.includes('sticker omitted')
        )
          continue;

        // Check that message is not a member addition, removal or group creation message
        if (
          Message.includes('added ' + Author) ||
          Message.includes('removed ' + Author) ||
          Message.includes(Author + ' left') ||
          Message.includes(Author + ' created this group') ||
          Message.includes(Author + ' created group “')
        )
          continue;

        // Check that message is not group edit or update
        if (
          Message.includes(Author + ` changed this group's icon`) ||
          Message.includes(Author + ' changed the group description')
        )
          continue;

        // Check that message is not a poll
        if (Message.includes('POLL:') && Message.includes('OPTION:')) continue;

        // Check that message is not a call
        if (Message.match(CALL_REGEX)) continue;

        const messageEntry: MessageEntry = {
          Day: Day.trim(),
          Month: Month.trim(),
          Year: Year.trim(),
          Hour: Hour.trim(),
          Minute: Minute.trim(),
          Second: Second.trim(),
          Author: Author.trim(),
          Message: Message.trim(),
        };
        groupMemberMessages.push(messageEntry);
      }
    }
  }

  return groupMemberMessages;
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

  // If group chat name is found, return it; otherwise, return a default message
  return gcName ? gcName : null;
}

// Function to convert 12-hour format to 24-hour format
function convertTo24HourFormat(hour: string, amPm: string) {
  let newHour = parseInt(hour, 10);
  if (amPm.toUpperCase() === 'PM' && newHour < 12) {
    newHour += 12;
  } else if (amPm.toUpperCase() === 'AM' && newHour === 12) {
    newHour = 0;
  }
  return newHour.toString().padStart(2, '0'); // Ensure hour is two digits
}
