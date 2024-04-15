'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import getGroupName from '../../getGroupName';
import getGroupMembers from '../../getGroupMembers';
import getGroupData from '../../getGroupData';
import searchGroupMessages from '../../searchGroupMessages';

const AcceptFile = () => {
  const [textFile, setTextFile] = useState('Has not changed state yet');
  const [groupChatName, setGroupChatName] = useState(
    'Has not changed state yet',
  );
  const [groupMemberList, setGroupMemberList] = useState({});
  const [groupMessages, setGroupMessages] = useState<
    {
      Day: string;
      Month: string;
      Year: string;
      Hour: string;
      Minute: string;
      Second: string;
      Author: string;
      Message: string;
    }[]
  >([]);
  const [matchedMessages, setMatchedMessages] = useState<
    (
      | {
          Day: string;
          Month: string;
          Year: string;
          Hour: string;
          Minute: string;
          Second: string;
          Author: string;
          Message: string;
        }
      | { hitCount: number }
    )[]
  >([]);

  const chatRef = useRef<HTMLInputElement>(null);

  const handleFile = () => {
    if (
      chatRef.current &&
      chatRef.current.files &&
      chatRef.current.files.length > 0
    ) {
      const file = chatRef.current.files[0];
      // Do something with the file, for example, read its contents
      const reader = new FileReader();
      reader.onload = event => {
        if (event.target && event.target.result) {
          setTextFile(event.target.result.toString());
          const temp = getGroupName(event.target.result.toString());
          if (temp) {
            setGroupChatName(temp);
          }
          const temp2 = getGroupMembers(event.target.result.toString());
          if (temp2) {
            setGroupMemberList(temp2);
          }
          const temp3 = getGroupData(event.target.result.toString());
          if (temp3) {
            setGroupMessages(temp3);
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    if (groupMessages) {
      const temp = searchGroupMessages(groupMessages, term);
      if (temp) {
        setMatchedMessages(temp);
      }
    }
  }, 300);

  function isMessageObject(message: any): message is {
    Day: string;
    Month: string;
    Year: string;
    Hour: string;
    Minute: string;
    Second: string;
    Author: string;
    Message: string;
  } {
    return (
      typeof message === 'object' &&
      'Day' in message &&
      'Month' in message &&
      'Year' in message &&
      'Hour' in message &&
      'Minute' in message &&
      'Second' in message &&
      'Author' in message &&
      'Message' in message
    );
  }

  return (
    <div>
      <input
        type="file"
        name="chatText"
        id="chatText"
        ref={chatRef}
        onChange={handleFile}
        className="p-10 bg-blue-600 border-8 w-full"
      />
      {groupChatName && <pre>{groupChatName}</pre>}
      <br />
      {groupMemberList && <pre>{JSON.stringify(groupMemberList)}</pre>}
      <br />
      {textFile && <pre>{textFile}</pre>}
      <br />
      {groupMessages &&
        groupMessages.map((message, index) => (
          <div key={index}>
            <p>
              Date: {message.Day}/{message.Month}/{message.Year}
            </p>
            <p>
              Time: {message.Hour}:{message.Minute}:{message.Second}
            </p>
            <p>Author: {message.Author}</p>
            <p>Message: {message.Message}</p>
            <br />
          </div>
        ))}
      <div className="relative flex flex-1 flex-shrink-0">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-black"
          // placeholder={placeholder}
          onChange={e => {
            handleSearch(e.target.value);
          }}
          // defaultValue={searchParams.get('query')?.toString()}
        />
      </div>
      <h1>Search Result:</h1>
      {matchedMessages &&
        matchedMessages.map((message, index) => (
          <div
            key={index}
            className="bg-green-500 w-full border-8 border-blue-600"
          >
            {isMessageObject(message) ? (
              <>
                <p>
                  Date: {message.Day}/{message.Month}/{message.Year}
                </p>
                <p>
                  Time: {message.Hour}:{message.Minute}:{message.Second}
                </p>
                <p>Author: {message.Author}</p>
                <p>Message: {message.Message}</p>
              </>
            ) : (
              <p>Hit Count: {message.hitCount}</p>
            )}
            <br />
          </div>
        ))}
    </div>
  );
};

export default AcceptFile;
