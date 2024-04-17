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
import getUserYapAmount from '../../getUserYapAmount';
import getUserMostUsedWords from '../../getUserMostUsedWords';

import {
  AreaChart,
  BarChart,
  BarList,
  Card,
  Divider,
  EventProps,
  LineChart,
  List,
  ListItem,
} from '@tremor/react';
import { RiUserLine } from '@remixicon/react';

const AcceptFile = () => {
  const [textFile, setTextFile] = useState('No chat input yet');
  const [groupChatName, setGroupChatName] = useState('Your Group Chat');
  const [groupMemberList, setGroupMemberList] = useState<
    {
      Name: string;
      Messages: number;
    }[]
  >([]);
  // Extract sender names from groupMemberList array
  const [groupAuthors, setGroupAuthors] = useState<string[]>(['Author 1']);
  const [groupMembersActivity, setGroupMembersActivity] = useState<
    {
      Name: string;
      Activity: number;
    }[]
  >([]);
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
  const [groupDates, setGroupDates] = useState<
    {
      date: string;
      Messages: number;
    }[]
  >([]);
  const [groupTimes, setGroupTimes] = useState<
    { hour: number; Messages: number }[]
  >([]);
  const [userMostActiveTimes, setUserMostActiveTimes] = useState<
    {
      Hour: number;
      [sender: string]: number;
    }[]
  >([]);
  const [groupMostActiveTime, setGroupMostActiveTime] = useState<
    { hour: number; Messages: number }[]
  >([]);
  const [topUsedWords, setTopUsedWords] = useState<
    {
      word: string;
      count: number;
    }[]
  >([]);
  const [userYapAmount, setUserYapAmount] = useState<
    {
      user: string;
      yapCount: number;
    }[]
  >([]);
  const [userMostUsedWords, setUserMostUsedWords] = useState({});

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
            // Extract sender names from groupMemberList array
            const senderNames = temp2.map(member => member.Name);
            setGroupAuthors(senderNames);
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
      const yappers = getUserYapAmount(groupMessages);
      setUserYapAmount(yappers);
      const lexicon = getUserMostUsedWords(groupMessages);
      setUserMostUsedWords(lexicon);
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

  const dataFormatter = (number: number): string => {
    const locale = navigator.language || 'en-GB'; // Default to 'en-GB' if navigator.language is not available
    return Intl.NumberFormat(locale).format(Math.round(number));
  };

  // Define an array of tremor colors from your tailwind config
  const tremorColors = [
    'indigo',
    'emerald',
    'yellow',
    'teal',
    'fuchsia',
    'slate',
    'lime',
    'gray',
    'zinc',
    'neutral',
    'stone',
    'red',
    'orange',
    'amber',
    'green',
    'cyan',
    'sky',
    'blue',
    'violet',
    'purple',
    'pink',
    'rose',
  ];

  const [dmaValue, setDMAValue] = useState<EventProps>(null);

  const transformedTopUsedWordsData = topUsedWords.map(item => ({
    value: item.count, // Assuming 'count' corresponds to the value property of Bar<T>
    name: item.word, // Assuming 'word' corresponds to the name property of Bar<T>
  }));

  const transformedYapperData = userYapAmount.map(item => ({
    value: item.yapCount,
    name: item.user,
  }));

  const [topUsedWordsVisibility, setTopUsedWordsVisibility] = useState(false);
  const [yapIndexVisibility, setYapIndexVisibility] = useState(false);

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
      <Card className="mx-auto">
        <p className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
          {groupChatName}
        </p>
        {Object.keys(groupMemberList).length > 0 && (
          <p className="mt-4 flex items-center justify-between text-tremor-default text-tremor-content dark:text-dark-tremor-content">
            <span>
              {groupMemberList.length > 1
                ? `${groupMemberList.length} members`
                : `${groupMemberList.length} member`}
            </span>
          </p>
        )}
      </Card>
      <Card className="mx-auto">
        <div className="flex flex-row justify-between">
          <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
            Group Members
          </h3>
          <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
            Messages
          </h3>
        </div>
        <List className="mt-2">
          {groupMemberList.map((member, index) => (
            <ListItem key={index}>
              <span className="flex flex-row">
                <RiUserLine />
                {member.Name}
              </span>
              <span>{member.Messages}</span>
            </ListItem>
          ))}
        </List>
      </Card>
      <Card className="mx-auto">
        <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
          Group Most Active Times
        </h3>
        <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content leading-6">
          Cumulative Hourly Messaging Frequency Ranked in Descending Order
        </p>
        <BarChart
          className="mt-6"
          data={groupMostActiveTime}
          index="hour"
          categories={['Messages']}
          colors={tremorColors.slice(Math.round(Math.random() * 21))}
          valueFormatter={dataFormatter}
          yAxisWidth={30}
        />
        <Divider>Hours</Divider>
      </Card>
      <Card className="mx-auto">
        <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
          Group Daily Messaging Activity
        </h3>
        <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content leading-6">
          Messaging Frequency Across Days
        </p>
        <AreaChart
          className="h-80"
          data={groupDates}
          index="date"
          categories={['Messages']}
          colors={tremorColors.slice(Math.round(Math.random() * 21))}
          valueFormatter={dataFormatter}
          yAxisWidth={30}
          showAnimation={true}
          autoMinValue={true}
        />
      </Card>
      <Card className="mx-auto">
        <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
          Daily Messaging Activity
        </h3>
        <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content leading-6">
          Cumulative Messaging Frequency Across Hours
        </p>
        <LineChart
          className="h-80"
          data={userMostActiveTimes}
          index="Hour"
          categories={groupAuthors}
          colors={tremorColors}
          valueFormatter={dataFormatter}
          yAxisWidth={30}
          showAnimation={true}
          autoMinValue={true}
          connectNulls={true}
          onValueChange={v => setDMAValue(v)}
        />
        <Divider>Hours</Divider>
      </Card>
      <Card className="mx-auto">
        <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
          Total Group Daily Messaging Activity
        </h3>
        <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content leading-6">
          Total Group Messaging Frequency Across Hours
        </p>
        <AreaChart
          className="h-80"
          data={groupTimes}
          index="hour"
          categories={['Messages']}
          colors={tremorColors.slice(Math.round(Math.random() * 21))}
          valueFormatter={dataFormatter}
          yAxisWidth={30}
          showAnimation={true}
          autoMinValue={true}
        />
        <Divider>Hours</Divider>
      </Card>
      <Card
        className="mx-auto cursor-pointer"
        onClick={() => setTopUsedWordsVisibility(prev => !prev)}
      >
        <h3 className="text-tremor-title text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
          Top Used Words
        </h3>
        {topUsedWordsVisibility && (
          <>
            <p className="mt-4 text-tremor-default flex items-center justify-between text-tremor-content dark:text-dark-tremor-content">
              <span>Words</span>
              <span>Count</span>
            </p>
            <BarList data={transformedTopUsedWordsData} className="mt-2" />
          </>
        )}
      </Card>
      <Card
        className="mx-auto cursor-pointer"
        onClick={() => setYapIndexVisibility(prev => !prev)}
      >
        <h3 className="text-tremor-title text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
          Top Yapper
        </h3>
        {yapIndexVisibility && (
          <>
            <p className="mt-4 text-tremor-default flex items-center justify-between text-tremor-content dark:text-dark-tremor-content">
              <span>Member</span>
              <span>Words</span>
            </p>
            <BarList data={transformedYapperData} className="mt-2" />
          </>
        )}
      </Card>

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
      {userMostUsedWords && (
        <>
          <h1>Users most used words:</h1>
          <pre>{JSON.stringify(userMostUsedWords)}</pre>
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
      {userYapAmount &&
        userYapAmount.map((yapper, index) => (
          <div
            key={index}
            className="bg-red-800 w-full border-8 border-blue-600"
          >
            <p>User: {yapper.user}</p>
            <p>Yap Index: {yapper.yapCount}</p>
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
