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

export default function searchGroupMessages(
  data: GroupMessage[],
  term: string,
  authors?: string[],
  startDate?: Date,
  endDate?: Date,
): (GroupMessage | { hitCount: number })[] | undefined {
  if (typeof data === 'object') {
    const SEARCH_REGEX = new RegExp(term, 'gi');
    const matchedMessages: (GroupMessage | { hitCount: number })[] = [];
    let hitCount = 0;

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
          if (res) {
            matchedMessages.push(message);
            hitCount += res.length;
          }
        }
      }
    }

    matchedMessages.push({ hitCount });

    return matchedMessages;
  } else {
    console.error('Error: Expected string data but received buffer');
  }
}
