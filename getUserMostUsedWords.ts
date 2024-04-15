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

type WordCountEntry = [string, number];

type UserMostUsedWords = Record<string, WordCountEntry[]>;

export default function getUserMostUsedWords(
  groupMessages: GroupMessage[],
): UserMostUsedWords {
  // Initialize an object to store words used by each author
  const wordsUsed: Record<string, Record<string, number>> = {};

  // Regex pattern to match words
  const wordsRegex = /\b(?![0-9]+\b)[\w’]+\b/g;

  // Count words used by each author
  for (const message of groupMessages) {
    const { Author, Message } = message;
    const words = Message.match(wordsRegex);

    if (words) {
      if (!wordsUsed[Author]) {
        wordsUsed[Author] = {};
      }

      for (const word of words) {
        wordsUsed[Author][word] = (wordsUsed[Author][word] || 0) + 1;
      }
    }
  }

  // Initialize an object to store top used words for each author
  const userMostUsedWords: UserMostUsedWords = {};

  // Calculate top used words for each author
  for (const author in wordsUsed) {
    const wordCountArray: WordCountEntry[] = Object.entries(wordsUsed[author]);
    wordCountArray.sort((a, b) => b[1] - a[1]);

    // Calculate maxLength based on word count
    let maxLength: number;

    if (wordCountArray.length < 5) {
      maxLength = wordCountArray.length;
    } else {
      maxLength = Math.min(25, Math.floor(wordCountArray.length / 5) * 5);
    }

    userMostUsedWords[author] = wordCountArray.slice(0, maxLength);
  }

  return userMostUsedWords;
}
