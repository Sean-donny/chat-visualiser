export default function searchGroupMessages(
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
) {
  // Type guard to ensure data is an object
  if (typeof data === 'object') {
    // Construct dynamic search regex with the provided term
    const SEARCH_REGEX = new RegExp(term, 'gi'); // 'gi' flags for global and case-insensitive search

    // Array to store matched messages
    const matchedMessages = [];

    // Variable to store how many times the search is matched
    let hitCount = 0;

    if (term !== '') {
      for (const message of data) {
        const res = message.Message.match(SEARCH_REGEX);
        if (res) {
          matchedMessages.push(message);
          hitCount += res.length;
        }
      }
    }

    matchedMessages.push({ hitCount: hitCount });

    return matchedMessages;
  } else {
    console.error('Error: Expected string data but received buffer');
  }
}

// Case Sensitive Toggle version

// export default function searchGroupMessages(
//   data: {
//     Day: string;
//     Month: string;
//     Year: string;
//     Hour: string;
//     Minute: string;
//     Second: string;
//     Author: string;
//     Message: string;
//   }[],
//   term: string,
//   caseSensitive: boolean,
// ) {
//   // Type guard to ensure data is an object
//   if (typeof data === 'object') {
//     // Construct dynamic search regex with the provided term and case sensitivity
//     const flags = caseSensitive ? 'g' : 'gi'; // 'g' flag for global search, 'i' flag for case-insensitive search
//     const SEARCH_REGEX = new RegExp(term, flags);

//     // Array to store matched messages
//     const matchedMessages = [];

//     // Variable to store how many times the search is matched
//     let hitCount = 0;

//     if (term !== '') {
//       for (const message of data) {
//         const res = message.Message.match(SEARCH_REGEX);
//         if (res) {
//           matchedMessages.push(message);
//           hitCount += res.length;
//         }
//       }
//     }

//     matchedMessages.push({ hitCount: hitCount });

//     return matchedMessages;
//   } else {
//     console.error('Error: Expected string data but received buffer');
//   }
// }
