'use client';

import React, { useRef, useState } from 'react';
import getGroupName from '../../getGroupName';
import getGroupMembers from '../../getGroupMembers';
import getGroupData from '../../getGroupData';

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

  return (
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
      {/* {groupMemberList && <pre>{JSON.stringify(groupMemberList)}</pre>}
      <br />
      {textFile && <pre>{textFile}</pre>}
      <br /> */}
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
    </div>
  );
};

export default AcceptFile;
