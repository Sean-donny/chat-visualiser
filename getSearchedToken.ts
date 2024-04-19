interface GroupSearches {
  sender: string;
  Matches: number;
}

export default function getSearchedToken(
  data: {
    Day: string;
    Month: string;
    Year: string;
    Hour: string;
    Minute: string;
    Second: string;
    Author: string;
    Message: string;
  }[],
  term: string,
): GroupSearches[] | void {
  // Type guard to ensure data is an object
  if (typeof data === 'object') {
    // Construct dynamic search regex with the provided term
    const SEARCH_REGEX = new RegExp(term, 'gi'); // 'gi' flags for global and case-insensitive search

    // Object to store the group members and their match value of the search token
    const groupSearches: Record<string, number> = {};

    if (term !== '') {
      for (const message of data) {
        const res = message.Message.match(SEARCH_REGEX);
        // If the message includes the search token, increment
        // Initialise sender in groupSearches if this sender has not yet been declared
        if (!groupSearches[message.Author]) {
          groupSearches[message.Author] = 0;
        }
        if (res) {
          groupSearches[message.Author] =
            (groupSearches[message.Author] || 0) + res.length;
        }
      }

      const searchMatches: GroupSearches[] = Object.keys(groupSearches).map(
        sender => ({
          sender: sender,
          Matches: groupSearches[sender],
        }),
      );
      return searchMatches;
    }
  }
}
