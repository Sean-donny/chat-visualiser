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

export default function getGroupData(data: string): MessageEntry[] | void {
  // Type guard to ensure data is a string
  if (typeof data === 'string') {
    // Remove all invisible characters
    const originalChat = data.replace(/‎/gm, '');

    // Regex for positive lookahead on timestamp
    const SPLIT_REGEX = /(?=^\[\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2}\])/m;

    // Regex to match message signature
    const MESSAGE_REGEX =
      /^\[(\d{2})\/(\d{2})\/(\d{4}),\s(\d{2}):(\d{2}):(\d{2})\]\s(.+?):\s([\s\S]*)/;

    const CALL_REGEX = /(?:Voice\scall|Video\scall),.+\d\s(?:sec|min|hr)/;

    // Split the chat by timestamps to get the individual messages
    const chatMessages = originalChat.split(SPLIT_REGEX).filter(Boolean);

    // Store group chat name
    const gcName = extractGroupName(data);

    // Array to store group member messages as objects
    const groupMemberMessages: MessageEntry[] = [];

    // Loop to iterate through messages and generate message entry object
    for (const line of chatMessages) {
      const match = MESSAGE_REGEX.exec(line);

      if (match !== null) {
        const [, Day, Month, Year, Hour, Minute, Second, Author, Message] =
          match;

        // Perform checks against irrelevant chat data

        // check that message is not from the group itself
        if (gcName !== null && Author.includes(gcName)) continue;

        // check that message is not an attachment
        if (
          Message.includes('audio omitted') ||
          Message.includes('image omitted') ||
          Message.includes('GIF omitted') ||
          Message.includes('Contact card omitted') ||
          Message.includes('document omitted') ||
          Message.includes('Location: https://maps.google.com/') ||
          Message.includes('sticker omitted')
        )
          continue;

        // check that message is not a member addition message
        if (
          Message.includes('You added ' + Author) ||
          Message.includes(Author + ' created this group')
        )
          continue;

        // check that message is not a poll
        if (Message.includes('POLL:') && Message.includes('OPTION:')) continue;

        // check that message is not a call
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

    return groupMemberMessages;
  } else {
    console.error('Error: Expected string data but received buffer');
  }
}

function extractGroupName(data: string): string | null {
  // Type guard to ensure data is a string
  if (typeof data === 'string') {
    // Regex to search for group chat creation message
    const groupChatNameRegex =
      /Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them./;

    // Remove all invisible characters
    const originalChat = data.replace(/‎/gm, '');

    // Strict regex to search for date
    const DATE_REGEX = /^\[\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2}\]\s/gm;

    // Store group chat name if found
    let gcName = 'Your Group Chat';

    // Split the chat by date to get the messages
    const chatMessages = originalChat.split(DATE_REGEX).splice(1);

    for (const message of chatMessages) {
      if (message.match(groupChatNameRegex)) {
        gcName = message.split(':')[0].trim();
        break;
      }
    }

    // If group chat name is found, return it; otherwise, return a default message
    return gcName ? gcName : null;
  } else {
    console.error('Error: Expected string data but received buffer');
    return null;
  }
}
