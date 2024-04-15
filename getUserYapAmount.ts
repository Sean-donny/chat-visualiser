// Type for a single message in the group chat
type GroupMessage = {
  Day: string;
  Month: string;
  Year: string;
  Hour: string;
  Minute: string;
  Second: string;
  Author: string;
  Message: string;
};

// Type for a word count entry
type WordCountEntry = [string, number];

// Type for a user's yap amount
type UserYapAmount = {
  user: string;
  yapCount: number;
};

export default function getUserYapAmount(
  groupMessages: GroupMessage[],
): UserYapAmount[] {
  const yapCountByUser: Record<string, number> = {};

  // Regex pattern to match words
  const wordsRegex = /\b(?![0-9]+\b)[\w’]+\b/g;

  for (const message of groupMessages) {
    const words = message.Message.match(wordsRegex); // Match words using the regex pattern
    if (words) {
      // Increment yap count for the author of the message
      if (yapCountByUser[message.Author]) {
        yapCountByUser[message.Author] += words.length;
      } else {
        yapCountByUser[message.Author] = words.length;
      }
    }
  }

  const yapCountArray: WordCountEntry[] = Object.entries(yapCountByUser);
  yapCountArray.sort((a, b) => b[1] - a[1]); // Sort by yap counts in descending order

  let maxLength: number;

  if (yapCountArray.length < 5) {
    maxLength = yapCountArray.length;
  } else {
    maxLength = Math.min(25, Math.floor(yapCountArray.length / 5) * 5);
  }

  // Return an array of users ranked by yap count up to the calculated maxLength
  return yapCountArray
    .slice(0, maxLength)
    .map(([user, yapCount]) => ({ user, yapCount }));
}
