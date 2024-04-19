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

// Type for a top used word
type TopUsedWord = {
  word: string;
  count: number;
};

export default function getTopUsedWords(
  groupMessages: GroupMessage[],
): TopUsedWord[] {
  const wordsUsed: Record<string, number> = {};
  const wordsRegex = /\b(?![0-9]+\b)[\w’]+\b/g; // Regex pattern to match words

  for (const message of groupMessages) {
    const words = message.Message.match(wordsRegex); // Match words using the regex pattern
    if (words) {
      for (const word of words) {
        // Count occurrences of each word
        if (wordsUsed[capitalizeFirstLetter(word)]) {
          wordsUsed[capitalizeFirstLetter(word)]++;
        } else {
          wordsUsed[capitalizeFirstLetter(word)] = 1;
        }
      }
    }
  }

  const wordCountArray: WordCountEntry[] = Object.entries(wordsUsed);
  wordCountArray.sort((a, b) => b[1] - a[1]); // Sort by word counts in descending order

  let maxLength: number;

  if (wordCountArray.length < 5) {
    maxLength = wordCountArray.length;
  } else {
    maxLength = Math.min(25, Math.floor(wordCountArray.length / 5) * 5);
  }

  // Return an array of top used words up to the calculated maxLength
  return wordCountArray
    .slice(0, maxLength)
    .map(([word, count]) => ({ word, count }));
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
