'use client';

import React, { useRef, useState } from 'react';
import getGroupName from '../../getGroupName';
import getGroupMembers from '../../getGroupMembers';

const AcceptFile = () => {
  const [textFile, setTextFile] = useState('Has not changed state yet');
  const [groupChatName, setGroupChatName] = useState(
    'Has not changed state yet',
  );
  const [groupMemberList, setGroupMemberList] = useState({});
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
      {groupMemberList && <pre>{JSON.stringify(groupMemberList)}</pre>}
      <br />
      {textFile && <pre>{textFile}</pre>}
    </div>
  );
};

export default AcceptFile;
