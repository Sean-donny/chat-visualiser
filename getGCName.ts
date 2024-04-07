'use server';
import fs from 'fs';

// Use fs.readFile with a callback function
const data = fs.readFileSync('./sample-chat.txt', {
  encoding: 'utf8',
  flag: 'r',
});

function getGroupName(data: string | Buffer) {
  // Type guard to ensure data is a string
  if (typeof data === 'string') {
    // Regex to search for group chat creation message
    const groupChatNameRegex = /(created\sgroup\s)([‘-‟])(.+)([‘-‟])/;

    // Attempt to extract group chat name
    const gcName = data.replace(/‎/gm, '').match(groupChatNameRegex);

    // If group chat name is found, print it; otherwise, print a default message
    if (gcName !== null) {
      return gcName[3];
      // console.log('From function:', gcName[3]);
    } else {
      return 'null';
      // console.log('Your Group Chat');
    }
  } else {
    console.error('Error: Expected string data but received buffer');
  }
}

const res = getGroupName(data);

export async function eggs() {
  return res;
}
