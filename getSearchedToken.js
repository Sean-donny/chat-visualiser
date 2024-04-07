export default function getSearchedToken(data) {
  // Removes all invisible characters
  const ogchat = data.toString().replace(/‎/gm, '');

  // Regex to search for date
  const DATE_REGEX = /^\[\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2}\]\s/gm;

  // Object to store the group members and their match value of the search token
  const groupSearches = {};

  // Get the group chat name
  const GROUP_NAME = extractGroupName(data);

  // Sets the regex search value for the chat search
  const SEARCH_VALUE = /✅/g;

  for (const line of ogchat.split(DATE_REGEX)) {
    const current = line.split(':');

    // Skip if current line is empty
    if (current.length !== 2) continue;

    // set the values of current as sender and message if it passes the above check
    let [sender, message] = current;
    sender = sender.trim();

    // Initialise sender in groupSearches if this sender has not yet been declared
    if (!groupSearches[sender]) {
      groupSearches[sender] = 0;
    }

    // Search for token in message
    var res = message.match(SEARCH_VALUE);

    // If the message includes the search token, increme
    if (res) {
      groupSearches[sender] = (groupSearches[sender] || 0) + res.length;
    }
  }

  // Delete the group itself as a member of this list if group name is extracted
  if (GROUP_NAME !== null) {
    delete groupSearches[GROUP_NAME];
  }
  return groupSearches;
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
