const fs = require('fs');

// Use fs.readFile with a callback function
fs.readFile('./sample-chat.txt', 'utf8', cb);

function cb(err, data) {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  // Type guard to ensure data is a string
  if (typeof data === 'string') {
    // Remove all invisible characters
    const originalChat = data.replace(/‎/gm, '');

    // Regex to search for date
    const DATE_REGEX = /^\[\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2}\]\s/gm;

    // Regex to search for words
    const wordsRegex = /\b(?![0-9]+\b)[\w’]+\b/g; // Match words including apostrophes & excluding numbers

    // Split the chat by date to get the messages
    const chatMessages = originalChat.split(DATE_REGEX);

    // Store group chat name
    const gcName = extractGroupName(data);

    // Object to store group member messages count
    const groupMemberWordCount = {};

    // Loop to iterate through messages and count member messages *********************
    for (const line of originalChat.split(DATE_REGEX)) {
      const current = line.split(':');

      // Skip if current line is empty
      if (current.length !== 2) continue;

      // set the values of current as sender and message if it passes the above check
      let [sender, message] = current;
      sender = sender.trim();
      message = message.trim();

      // Skip if message is empty
      if (!message.length) continue;

      // Initialise sender in groupMemberWordCount if this sender has not yet been declared
      if (!groupMemberWordCount[sender]) {
        groupMemberWordCount[sender] = {};
      }

      // Extract words used in message
      const wordsBatch = message.match(wordsRegex);

      // Count the occurrences of each word
      if (wordsBatch) {
        for (const word of wordsBatch) {
          if (groupMemberWordCount[sender][word]) {
            groupMemberWordCount[sender][word]++;
          } else {
            groupMemberWordCount[sender][word] = 1;
          }
        }
      }
    }

    // Limit the top words for each sender to 20
    for (const sender in groupMemberWordCount) {
      const wordCountArray = Object.entries(groupMemberWordCount[sender]);
      wordCountArray.sort((a, b) => b[1] - a[1]);
      let maxLength;
      if (wordCountArray.length < 5) {
        maxLength = wordCountArray.length;
      } else if (wordCountArray.length < 20) {
        maxLength = Math.floor(wordCountArray.length / 5) * 5;
      } else {
        maxLength = 20;
      }
      groupMemberWordCount[sender] = wordCountArray.slice(0, maxLength);
    }

    delete groupMemberWordCount[gcName];

    console.log(groupMemberWordCount);
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
