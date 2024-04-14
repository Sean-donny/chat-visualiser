export default function getTopUsedWords(data) {
  // Type guard to ensure data is a string
  if (typeof data === 'string') {
    // Remove all invisible characters
    const originalChat = data.replace(/‎/gm, '');

    // Regex to search for date
    const DATE_REGEX = /^\[\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2}\]\s/gm;

    // Regex to search for names and words
    const senderNameRegex = /^.+:\s/g;
    const wordsRegex = /\b(?![0-9]+\b)[\w’]+\b/g; // Match words including apostrophes & excluding numbers

    // Split the chat by date to get the messages
    const chatMessages = originalChat.split(DATE_REGEX).splice(1);

    const gcName = extractGroupName(data);

    // Object to store word counts
    const wordsUsed = {};

    // Loop to iterate through messages and count words
    for (const message of chatMessages) {
      // Skip empty messages
      if (!message.length) {
        continue;
      }

      // Check if the message starts with the group name
      if (gcName !== null) {
        if (message.includes(gcName)) {
          continue; // Skip the message
        }
      }

      // Skip messages that contain omitted audio, image, or sticker
      if (
        message.includes('audio omitted') ||
        message.includes('Image omitted') ||
        message.includes('sticker omitted')
      ) {
        continue;
      }

      // Extract words from the message
      const justMessages = message.replace(senderNameRegex, '');
      const wordsBatch = justMessages.match(wordsRegex);

      // Count the occurrences of each word
      if (wordsBatch) {
        for (const word of wordsBatch) {
          if (wordsUsed[word]) {
            wordsUsed[word]++;
          } else {
            wordsUsed[word] = 1;
          }
        }
      }
    }

    // Remove 'omitted' from the word counts
    delete wordsUsed['omitted'];

    // Convert wordsUsed object into an array of key-value pairs
    const wordCountArray = Object.entries(wordsUsed);

    // Sort the array based on the word counts in descending order
    wordCountArray.sort((a, b) => b[1] - a[1]);

    let maxLength;

    if (wordCountArray.length < 5) {
      maxLength = wordCountArray.length;
    } else {
      maxLength = Math.min(100, Math.floor(wordCountArray.length / 5) * 5);
    }

    const topUsedWords = wordCountArray
      .slice(0, maxLength)
      .map(([text, value]) => ({ text, value }));

    return topUsedWords;
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
