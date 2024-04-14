const fs = require('fs');

// Use fs.readFile with a callback function
fs.readFile('./testSampleChat.txt', 'utf8', cb);

function cb(err, data) {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
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
    const groupMemberMessages = [];

    // Loop to iterate through messages and generate message entry object
    for (const line of chatMessages) {
      const match = MESSAGE_REGEX.exec(line);

      if (match !== null) {
        const Day = match[1].trim();
        const Month = match[2].trim();
        const Year = match[3].trim();
        const Hour = match[4].trim();
        const Minute = match[5].trim();
        const Second = match[6].trim();
        const Author = match[7].trim();
        const Message = match[8].trim();
        // Perform checks against irrelevant chat data

        // check that message is not from the group itself
        if (gcName !== null) {
          if (Author.includes(gcName)) continue;
        }

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

        const messageEntry = {
          Day: Day,
          Month: Month,
          Year: Year,
          Hour: Hour,
          Minute: Minute,
          Second: Second,
          Author: Author,
          Message: Message,
        };
        groupMemberMessages.push(messageEntry);
      }
    }

    console.log(groupMemberMessages);
  } else {
    console.error('Error: Expected string data but received buffer');
  }
}

function extractGroupName(data) {
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
  }
}
