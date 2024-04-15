'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import getGroupName from '../../getGroupName';
import getGroupMembers from '../../getGroupMembers';
import getGroupMembersActivity from '../../getGroupMembersActivity';
import getGroupData from '../../getGroupData';
import searchGroupMessages from '../../searchGroupMessages';
import getDates from '../../getDates';
import getTimes from '../../getTimes';
import getUserMostActiveTimes from '../../getUserMostActiveTimes';
import getMostActiveTime from '../../getMostActiveTime';
import getTopUsedWords from '../../getTopUsedWords';

const AcceptFile = () => {
  const [textFile, setTextFile] = useState('Has not changed state yet');
  const [groupChatName, setGroupChatName] = useState(
    'Has not changed state yet',
  );
  const [groupMemberList, setGroupMemberList] = useState({});
  const [groupMembersActivity, setGroupMembersActivity] = useState({});
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
  const [groupDates, setGroupDates] = useState({});
  const [groupTimes, setGroupTimes] = useState({});
  const [userMostActiveTimes, setUserMostActiveTimes] = useState({});
  const [groupMostActiveTime, setGroupMostActiveTime] = useState({});
  const [topUsedWords, setTopUsedWords] = useState<
    {
      word: string;
      count: number;
    }[]
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
          const temp4 = getDates(event.target.result.toString());
          if (temp4) {
            setGroupDates(temp4);
          }
          const temp5 = getTimes(event.target.result.toString());
          if (temp5) {
            setGroupTimes(temp5);
          }
          const temp6 = getMostActiveTime(event.target.result.toString());
          if (temp6) {
            setGroupMostActiveTime(temp6);
          }
          const temp7 = getGroupMembersActivity(event.target.result.toString());
          if (temp7) {
            setGroupMembersActivity(temp7);
          }
          const temp8 = getUserMostActiveTimes(event.target.result.toString());
          if (temp8) {
            setUserMostActiveTimes(temp8);
          }
        }
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    // Call getTopUsedWords whenever groupMessages changes (i.e., when getGroupData finishes processing)
    if (groupMessages.length > 0) {
      const words = getTopUsedWords(groupMessages); // Call getTopUsedWords with groupMessages
      setTopUsedWords(words); // Update topUsedWords state
    }
  }, [groupMessages]); // Dependency on groupMessages

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
      {groupMemberList && (
        <>
          <h1>Group Members Alphabetically: </h1>
          <pre>{JSON.stringify(groupMemberList)}</pre>
        </>
      )}
      <br />
      {groupMembersActivity && (
        <>
          <h1>Group Members Ranked by Activity: </h1>
          <pre>{JSON.stringify(groupMembersActivity)}</pre>
        </>
      )}
      <br />
      {groupDates && (
        <>
          <h1>Group Dates:</h1>
          <pre>{JSON.stringify(groupDates)}</pre>
        </>
      )}
      <br />
      {groupTimes && (
        <>
          <h1>Group Times:</h1>
          <pre>{JSON.stringify(groupTimes)}</pre>
        </>
      )}
      <br />
      {userMostActiveTimes && (
        <>
          <h1>Users Most Active Times:</h1>
          <pre>{JSON.stringify(userMostActiveTimes)}</pre>
        </>
      )}
      <br />
      {groupMostActiveTime && (
        <>
          <h1>Group Most Active Time:</h1>
          <pre>{JSON.stringify(groupMostActiveTime)}</pre>
        </>
      )}
      <br />
      {topUsedWords &&
        topUsedWords.map((word, index) => (
          <div
            key={index}
            className="bg-green-500 w-full border-8 border-blue-600"
          >
            <p>Word: {word.word}</p>
            <p>Count: {word.count}</p>
            <br />
          </div>
        ))}
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
