'use client';

import React, { useRef, useState } from 'react';
import getGroupName from '../../getGroupName';
import getGroupMembers from '../../getGroupMembers';
import getTopUsedWords from '../../getTopUsedWords';
import { Text } from '@visx/text';
import { scaleLog } from '@visx/scale';
import Wordcloud from '@visx/wordcloud/lib/Wordcloud';
import { totoAfricaLyrics } from './dummyText';

interface ExampleProps {
  width: number;
  height: number;
  showControls?: boolean;
}

export interface WordData {
  text: string;
  value: number;
}

const colors = ['#143059', '#2F6B9A', '#82a6c2'];

function wordFreq(text: string): WordData[] {
  const words: string[] = text.replace(/\./g, '').split(/\s/);
  const freqMap: Record<string, number> = {};

  for (const w of words) {
    if (!freqMap[w]) freqMap[w] = 0;
    freqMap[w] += 1;
  }
  return Object.keys(freqMap).map(word => ({
    text: word,
    value: freqMap[word],
  }));
}

function getRotationDegree() {
  const rand = Math.random();
  const degree = rand > 0.5 ? 60 : -60;
  return rand * degree;
}

let words = wordFreq(totoAfricaLyrics);
console.log(words);

const fontScale = scaleLog({
  domain: [
    Math.min(...words.map(w => w.value)),
    Math.max(...words.map(w => w.value)),
  ],
  range: [10, 100],
});
const fontSizeSetter = (datum: WordData) => fontScale(datum.value);

const fixedValueGenerator = () => 0.5;

type SpiralType = 'archimedean' | 'rectangular';

export default function TopWordsCloud({
  width,
  height,
  showControls,
}: ExampleProps) {
  const [spiralType, setSpiralType] = useState<SpiralType>('archimedean');
  const [withRotation, setWithRotation] = useState(false);

  const [textFile, setTextFile] = useState('Has not changed state yet');
  const [groupChatName, setGroupChatName] = useState(
    'Has not changed state yet',
  );
  const [groupMemberList, setGroupMemberList] = useState({});
  const [groupMemberWordList, setGroupMemberWordList] = useState({});
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
          const topUsedWords = getTopUsedWords(event.target.result.toString());
          if (topUsedWords) {
            setGroupMemberWordList(topUsedWords);
            console.log(topUsedWords);
            words = topUsedWords;
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      <div>
        <input
          type="file"
          name="chatText"
          id="chatText"
          ref={chatRef}
          onChange={handleFile}
        />
        {groupChatName && <pre>{groupChatName}</pre>}
        <br />
        {groupMemberList && <pre>{JSON.stringify(groupMemberList)}</pre>}
        <br />
        {groupMemberWordList && (
          <pre>{JSON.stringify(groupMemberWordList)}</pre>
        )}
      </div>
      <div className="wordcloud">
        <Wordcloud
          words={words}
          width={width}
          height={height}
          fontSize={fontSizeSetter}
          font={'Arial'}
          padding={2}
          spiral={spiralType}
          rotate={withRotation ? getRotationDegree : 0}
          random={fixedValueGenerator}
        >
          {cloudWords =>
            cloudWords.map((w, i) => (
              <Text
                key={w.text}
                fill={colors[i % colors.length]}
                textAnchor={'middle'}
                transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
                fontSize={w.size}
                fontFamily={w.font}
              >
                {w.text}
              </Text>
            ))
          }
        </Wordcloud>

        <style jsx>{`
          .wordcloud {
            display: flex;
            flex-direction: column;
            user-select: none;
          }
          .wordcloud svg {
            margin: 1rem 0;
            cursor: pointer;
          }

          .wordcloud label {
            display: inline-flex;
            align-items: center;
            font-size: 14px;
            margin-right: 8px;
          }
          .wordcloud textarea {
            min-height: 100px;
          }
        `}</style>
      </div>
    </>
  );
}
