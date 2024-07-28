'use client';

import React, { useEffect, useState } from 'react';
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
// import getUserMostUsedWords from '../../getUserMostUsedWords';
import { useDebouncedCallback } from 'use-debounce';
import Image from 'next/image';
import ChatVizLogo from '../../public/ChatVizLogo.svg';
import ChatVizIcon from '../../public/chat-visualisation-icon.png';

import {
  AreaChart,
  BarChart,
  BarList,
  Card,
  DateRangePicker,
  DateRangePickerValue,
  Divider,
  DonutChart,
  EventProps,
  LineChart,
  List,
  ListItem,
  MultiSelect,
  MultiSelectItem,
  TextInput,
} from '@tremor/react';
import { RiSearchLine, RiUserLine, RiFileAddLine } from '@remixicon/react';
import getSearchedToken from '../../getSearchedToken';
import { motion } from 'framer-motion';
import Link from 'next/link';

const dataFormatter = (number: number): string => {
  const locale =
    typeof navigator !== 'undefined' ? navigator.language : 'en-GB';
  return Intl.NumberFormat(locale).format(Math.round(number));
};

const AcceptFile = () => {
  type DateFormat = 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy/mm/dd';
  type TimeFormat = 'hh:mm:ss' | 'hh:mm:ss a';

  // Define states
  const [groupChatName, setGroupChatName] = useState<string>('Your Group Chat');
  const [groupMemberList, setGroupMemberList] = useState<
    {
      Name: string;
      Messages: number;
    }[]
  >([]);
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
  const [matchedMessagesCounts, setMatchedMessagesCounts] = useState<
    { sender: string; Matches: number }[]
  >([]);
  const [groupDates, setGroupDates] = useState<
    {
      date: string;
      Messages: number;
    }[]
  >([]);
  const [groupTimes, setGroupTimes] = useState<
    { hour: string; Messages: number }[]
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
  // This function did not prove useful
  // const [userMostUsedWords, setUserMostUsedWords] = useState({});

  // Function to handle file processing
  const processFileContent = (
    fileContent: string,
    dateFormat: DateFormat,
    timeFormat: TimeFormat,
  ) => {
    const groupName = getGroupName(fileContent, dateFormat, timeFormat);
    if (groupName) setGroupChatName(groupName);

    const members = getGroupMembers(fileContent, dateFormat, timeFormat);
    if (members) {
      setGroupMemberList(members);
      setGroupAuthors(members.map(member => member.Name));
    }

    const messages = getGroupData(fileContent, dateFormat, timeFormat);
    if (messages) setGroupMessages(messages);

    const dates = getDates(fileContent, dateFormat, timeFormat);
    if (dates) setGroupDates(dates);

    const times = getTimes(fileContent, dateFormat, timeFormat);
    if (times) setGroupTimes(times);

    const mostActiveTime = getMostActiveTime(
      fileContent,
      dateFormat,
      timeFormat,
    );
    if (mostActiveTime) setGroupMostActiveTime(mostActiveTime);

    const membersActivity = getGroupMembersActivity(
      fileContent,
      dateFormat,
      timeFormat,
    );
    if (membersActivity) setGroupMembersActivity(membersActivity);

    const userActiveTimes = getUserMostActiveTimes(
      fileContent,
      dateFormat,
      timeFormat,
    );
    if (userActiveTimes) setUserMostActiveTimes(userActiveTimes);
  };

  // UseEffect to initialize state from localStorage/sessionStorage
  useEffect(() => {
    const fileContent = sessionStorage.getItem('chatFileContent');
    const dateFormat = sessionStorage.getItem('dateFormat');
    const timeFormat = sessionStorage.getItem('timeFormat');
    if (fileContent) {
      processFileContent(
        fileContent,
        dateFormat as DateFormat,
        timeFormat as TimeFormat,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update related states when groupMessages changes
  useEffect(() => {
    if (groupMessages.length > 0) {
      const words = getTopUsedWords(groupMessages);
      setTopUsedWords(words);

      const yapAmount = getUserYapAmount(groupMessages);
      setUserYapAmount(yapAmount);

      // const lexicon = getUserMostUsedWords(groupMessages);
      // setUserMostUsedWords(lexicon);
    }
  }, [groupMessages]);

  const [emptySearch, setEmptySearch] = useState(true);
  const [term, setTerm] = useState<string>('');
  const [authors, setAuthors] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
    handleSearch(
      e.target.value,
      authors,
      startDate ?? undefined,
      endDate ?? undefined,
    );
  };

  const handleAuthorsChange = (values: string[]) => {
    setAuthors(values);
    handleSearch(term, values, startDate ?? undefined, endDate ?? undefined);
  };

  const handleDateChange = (range: {
    from?: Date;
    to?: Date;
    selectValue?: string;
  }) => {
    const from = range.from ?? null;
    const to = range.to ?? null;
    setStartDate(from);
    setEndDate(to);
    handleSearch(term, authors, from ?? undefined, to ?? undefined);
  };

  const handleSearch = useDebouncedCallback(
    (term: string, authors?: string[], startDate?: Date, endDate?: Date) => {
      if (term !== '') {
        setEmptySearch(false);
        if (groupMessages) {
          const matchedMsgs = searchGroupMessages(
            groupMessages,
            term,
            authors,
            startDate,
            endDate,
          );
          if (matchedMsgs) setMatchedMessages(matchedMsgs);

          const matchedCounts = getSearchedToken(
            groupMessages,
            term,
            authors,
            startDate,
            endDate,
          );
          if (matchedCounts) setMatchedMessagesCounts(matchedCounts);
        }
      } else {
        setEmptySearch(true);
        setMatchedMessages([]);
      }
    },
    300,
  );

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

  const tremorColors = [
    'indigo',
    'emerald',
    'yellow',
    'teal',
    'fuchsia',
    'lime',
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
    value: item.count,
    name: item.word,
  }));

  const transformedYapperData = userYapAmount.map(item => ({
    value: item.yapCount,
    name: item.user,
  }));

  const transformedMostActiveMemberData = groupMembersActivity.map(item => ({
    value: item.Activity,
    name: item.Name,
  }));

  const [topUsedWordsVisibility, setTopUsedWordsVisibility] = useState(false);
  const [yapIndexVisibility, setYapIndexVisibility] = useState(false);
  const [mostActiveMemberVisibility, setMostActiveMemberVisibility] =
    useState(false);

  const searchResults = (
    <List>
      {matchedMessages &&
        matchedMessages.map((message, index) => (
          <ListItem key={index}>
            <div className="w-full">
              {isMessageObject(message) && (
                <div className="flex flex-col w-full p-4 rounded-md bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle overflow-x-auto">
                  <div className="flex justify-between">
                    <p className="text-emerald-500 font-semibold">
                      {message.Author}
                    </p>
                    <p className="text-sm text-right">
                      {message.Hour}:{message.Minute} - {message.Day}/
                      {message.Month}/{message.Year}
                    </p>
                  </div>
                  {message.Message.split('\n').map((lines, index) => (
                    <p
                      className="text-tremor-content-strong dark:text-dark-tremor-content-strong py-2"
                      key={index}
                    >
                      {lines}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </ListItem>
        ))}
    </List>
  );

  const searchStats = (
    <>
      <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium mt-5">
        Search Statistics
      </h3>
      <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content leading-6">
        Group Member Search Matches
      </p>
      <BarChart
        className="mt-6"
        data={matchedMessagesCounts}
        index="sender"
        categories={['Matches']}
        colors={['emerald']}
        valueFormatter={dataFormatter}
        yAxisWidth={55}
      />

      {matchedMessages.slice(-1).map((message, index) => (
        <Divider key={index}>
          Search matches: {!isMessageObject(message) && message.hitCount}
        </Divider>
      ))}
    </>
  );

  const searchConsole = (
    <>
      {searchStats}
      {searchResults}
    </>
  );

  return (
    <div className="bg-tremor-background dark:bg-dark-tremor-background">
      <nav className="sticky top-0 left-0 z-50 w-full h-0 overflow-visible">
        <ul className="flex flex-row justify-between items-center">
          <motion.li whileHover={{ scale: 0.95 }} whileTap={{ scale: 0.85 }}>
            <Link href={'/'}>
              <Image
                priority={true}
                src={ChatVizLogo}
                alt="ChatViz Logo"
                width="96"
                className="m-5 brightness-0 dark:brightness-100"
              />
            </Link>
          </motion.li>
          <motion.li whileHover={{ scale: 0.95 }} whileTap={{ scale: 0.85 }}>
            <Link href={'/upload'}>
              <RiFileAddLine size={40} className="m-5" />
            </Link>
          </motion.li>
        </ul>
      </nav>
      <Card className="mx-auto">
        <p className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong mt-24">
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
        <div className="flex flex-col md:flex-row gap-5">
          <Card className="w-full md:w-3/4">
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
          <Card className="w-full md:w-1/4 items-start">
            <span className="text-center block font-mono text-tremor-default text-tremor-content dark:text-dark-tremor-content">
              Group Messages
            </span>
            <div className="flex justify-center mt-5">
              <DonutChart
                data={transformedMostActiveMemberData}
                variant="pie"
                valueFormatter={dataFormatter}
                colors={tremorColors}
              />
            </div>
          </Card>
        </div>
      </Card>
      <Card className="mx-auto flex flex-col gap-5">
        <Card className="mx-auto">
          <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
            Group Most Active Times
          </h3>
          <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content leading-6 mt-2 py-2">
            Cumulative Hourly Messaging Frequency Ranked in
            Descending&nbsp;Order
          </p>
          <BarChart
            className="mt-6"
            data={groupMostActiveTime}
            index="hour"
            categories={['Messages']}
            colors={['emerald']}
            valueFormatter={dataFormatter}
            yAxisWidth={45}
          />
          <Divider>Hours</Divider>
        </Card>
        <Card className="mx-auto">
          <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
            Group Daily Messaging Activity
          </h3>
          <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content leading-6 mt-2 py-2">
            Messaging Frequency Across&nbsp;Days
          </p>
          <AreaChart
            className="h-80"
            data={groupDates}
            index="date"
            categories={['Messages']}
            colors={['emerald']}
            valueFormatter={dataFormatter}
            yAxisWidth={45}
            showAnimation={true}
            autoMinValue={true}
          />
        </Card>
        <Card className="mx-auto">
          <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
            Daily Messaging Activity
          </h3>
          <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content leading-6 mt-2 py-2">
            Cumulative Messaging Frequency Across&nbsp;Hours
          </p>
          <LineChart
            className="h-80"
            enableLegendSlider={true}
            data={userMostActiveTimes}
            index="Hour"
            categories={groupAuthors}
            colors={tremorColors}
            valueFormatter={dataFormatter}
            yAxisWidth={45}
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
          <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content leading-6 mt-2 py-2">
            Total Group Messaging Frequency Across&nbsp;Hours
          </p>
          <AreaChart
            className="h-80"
            data={groupTimes}
            index="hour"
            categories={['Messages']}
            colors={['emerald']}
            valueFormatter={dataFormatter}
            yAxisWidth={45}
            showAnimation={true}
            autoMinValue={true}
          />
          <Divider>Hours</Divider>
        </Card>
        <Card
          className="mx-auto cursor-pointer"
          onClick={() => setMostActiveMemberVisibility(prev => !prev)}
        >
          <h3 className="text-tremor-title text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
            Most Active Members
          </h3>
          {mostActiveMemberVisibility && (
            <>
              <p className="mt-4 text-tremor-default flex items-center justify-between text-tremor-content dark:text-dark-tremor-content">
                <span>Member</span>
                <span>Messages</span>
              </p>
              <BarList
                data={transformedMostActiveMemberData}
                className="mt-2"
              />
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
      </Card>
      {matchedMessages && (
        <Card className="mx-auto min-h-[37.5rem]">
          <div className="relative flex flex-1 flex-shrink-0">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <TextInput
              icon={RiSearchLine}
              placeholder="Search..."
              onChange={handleInputChange}
              className="mx-auto max-w-md"
            />
          </div>
          <div className="mx-auto max-w-md space-y-3 mt-4">
            <p className="text-center text-sm text-slate-500">Filters</p>
            <DateRangePicker
              enableYearNavigation={true}
              onValueChange={handleDateChange}
              className="mx-auto max-w-md"
            />
            <MultiSelect
              icon={RiUserLine}
              placeholder="Filter by Author"
              onValueChange={handleAuthorsChange}
            >
              {groupMemberList.map((member, index) => (
                <MultiSelectItem value={member.Name} key={index}>
                  {member.Name}
                </MultiSelectItem>
              ))}
            </MultiSelect>
          </div>
          {!emptySearch ? (
            searchConsole
          ) : (
            <div className="flex flex-col w-full h-[550px] justify-center items-center">
              <Image
                priority={true}
                src={ChatVizIcon}
                alt="ChatViz Icon"
                width={1080 / 4}
                height={1269 / 4}
                className="p-5 mix-blend-normal dark:mix-blend-screen"
              />
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default AcceptFile;
