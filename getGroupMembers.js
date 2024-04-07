export default function getGroupMembers(data) {
  // Type guard to ensure data is a string
  if (typeof data === 'string') {
    // Remove all invisible characters
    const originalChat = data.replace(/‎/gm, '');

    // Regex to search for date
    const DATE_REGEX = /^\[\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2}\]\s/gm;

    // Split the chat by date to get the messages
    const chatMessages = originalChat.split(DATE_REGEX);

    // Store group chat name
    const gcName = extractGroupName(data);

    // Object to store group member messages count
    const groupMembers = {};

    // Loop to iterate through messages and count member messages
    for (const message of chatMessages) {
      // Skip empty messages
      if (!message.length) {
        continue;
      }

      // Extract sender's name from the message
      const currentName = message.split(':')[0].trim();

      // Increment count of group member messages
      groupMembers[currentName] = (groupMembers[currentName] || 0) + 1;
    }

    // Delete the group itself as a member of this list if group name is extracted
    if (gcName !== null) {
      delete groupSearches[gcName];
    }

    return groupMembers;
  } else {
    console.error('Error: Expected string data but received buffer');
  }
}

function extractGroupName(data) {
  // Type guard to ensure data is a string
  if (typeof data === 'string') {
    // Regex to search for group chat creation message
    const groupChatNameRegex = /(created\sgroup\s)([‘-‟])(.+)([‘-‟])/;

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
  }
}
