type SenderActiveTimes = { [sender: string]: number[] };

export default function getUserMostActiveTimes(
  data: string,
): SenderActiveTimes | null {
  // Regular expression to match timestamps
  const TIMESTAMP_REGEX =
    /\[(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):\d{2}:\d{2}\]\s([^:]+):/g;

  // Store group chat name
  const gcName = extractGroupName(data);

  if (!gcName) {
    console.error('Error: Group chat name not found');
    return null;
  }

  // Object to store sender-hour counts
  const senderActiveTimes: SenderActiveTimes = {};

  // Extract sender and hour from each timestamp and update senderActiveTimes
  let match;
  while ((match = TIMESTAMP_REGEX.exec(data)) !== null) {
    const hour = parseInt(match[4], 10); // Extract the hour from the timestamp
    const sender = match[5].trim(); // Extract the sender

    // Initialize sender in senderActiveTimes if not already present
    if (!senderActiveTimes[sender]) {
      senderActiveTimes[sender] = Array.from({ length: 24 }, () => 0);
    }

    // Increment the count for the corresponding hour
    senderActiveTimes[sender][hour]++;
  }

  delete senderActiveTimes[gcName];

  return senderActiveTimes;
}

function extractGroupName(data: string): string | null {
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

  // If group chat name is found, return it; otherwise, return null
  return gcName !== 'Your Group Chat' ? gcName : null;
}
