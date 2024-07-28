interface GroupMessage {
  Day: string;
  Month: string;
  Year: string;
  Hour: string;
  Minute: string;
  Second: string;
  Author: string;
  Message: string;
}

interface GroupSearches {
  sender: string;
  Matches: number;
}

export default function getSearchedToken(
  data: GroupMessage[],
  term: string,
  authors?: string[],
  startDate?: Date,
  endDate?: Date,
): GroupSearches[] | void {
  if (typeof data === 'object') {
    const SEARCH_REGEX = new RegExp(term, 'gi');
    const groupSearches: Record<string, number> = {};

    if (term !== '') {
      for (const message of data) {
        const messageDate = new Date(
          `${message.Year}-${message.Month}-${message.Day}T${message.Hour}:${message.Minute}:${message.Second}`,
        );
        const isInDateRange =
          (!startDate || messageDate >= startDate) &&
          (!endDate || messageDate <= endDate);
        const isAuthorMatch =
          !authors || authors.length === 0 || authors.includes(message.Author);

        if (isInDateRange && isAuthorMatch) {
          const res = message.Message.match(SEARCH_REGEX);
          if (!groupSearches[message.Author]) {
            groupSearches[message.Author] = 0;
          }
          if (res) {
            groupSearches[message.Author] =
              (groupSearches[message.Author] || 0) + res.length;
          }
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
