var fs = require('fs');

// Use fs.readFile with a callback function
fs.readFile('./sample-chat.txt', 'utf8', cb);

function cb(err, data) {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Removes all invisible characters

  const ogchat = data.toString().replace(/‎/gm, '');

  // Gets all date and time at head of line and converts it to and empty string, then splitting the text by any occurance of \r\n

  const chat = ogchat.replace(/^\[.*\]\s/gm, '').split('\r\n');

  // Creates a dictionary to store group members

  const groupMembers = {};

  // Gets the group name by fetching the text at the 0 index of the chat and splitting it at the ":" then returning the 0 index item of the function

  const GROUP_NAME = chat[0].split(':')[0];

  // Sets the regex search value for the chat search

  const SEARCH_VALUE = /✅/g;

  //   for (let item of chat) {
  //     if (item.length <= 0) {
  //       continue;
  //     }
  //     const newChat = item.split(':');
  //     if (groupMembers[newChat[0]] === undefined) {
  //       groupMembers[newChat[0]] = 0;
  //     }
  //     for (let message of newChat.splice(1)) {
  //       var res = message.match(SEARCH_VALUE);
  //       if (res) {
  //         groupMembers[newChat[0]] += res.length;
  //       }
  //     }
  //   }
  //   delete groupMembers[GROUP_NAME];
  //   console.log(groupMembers);
}
