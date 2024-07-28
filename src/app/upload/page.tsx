'use client';
import Image from 'next/image';
import ChatVizLogo from '../../../public/ChatVizLogo.svg';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Demo from '../../../demo';

export default function Upload() {
  type DateFormat = 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy/mm/dd';
  type TimeFormat = 'hh:mm:ss' | 'hh:mm:ss a';
  const chatRef = useRef<HTMLInputElement>(null);
  const [dateFormat, setDateFormat] = useState<DateFormat>('dd/mm/yyyy');
  const [timeFormat, setTimeFormat] = useState<TimeFormat>('hh:mm:ss');
  const [hasFileError, setHasFileError] = useState<boolean>(false); // Error state for file upload

  const handleDateFormatChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedFormat = event.target.value as DateFormat;
    setDateFormat(selectedFormat);
  };

  const handleTimeFormatChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedFormat = event.target.value as TimeFormat;
    setTimeFormat(selectedFormat);
  };

  const router = useRouter(); // Initialize useRouter

  const processFileContent = (fileContent: string) => {
    sessionStorage.setItem('chatFileContent', fileContent); // Store file content in sessionStorage
  };

  const storePreferences = (dateFormat: DateFormat, timeFormat: TimeFormat) => {
    sessionStorage.setItem('dateFormat', dateFormat);
    sessionStorage.setItem('timeFormat', timeFormat);
  };

  const handleFile = () => {
    if (
      chatRef.current &&
      chatRef.current.files &&
      chatRef.current.files.length > 0
    ) {
      const file = chatRef.current.files[0];
      // Validate file type
      if (file.type !== 'text/plain') {
        setHasFileError(true);
        alert('Please upload a .txt file.');
        return;
      }
      setHasFileError(false); // Clear the error state if a valid file is selected

      const reader = new FileReader();
      reader.onload = event => {
        if (event.target && event.target.result) {
          processFileContent(event.target.result.toString());
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Manual validation for file input
    const fileInStorage = sessionStorage.getItem('chatFileContent');
    if (!chatRef.current?.files?.length && !fileInStorage) {
      setHasFileError(true); // Set error state if no file is selected
      alert('Please select a file.');
      return;
    }
    if (fileInStorage) {
      processFileContent(fileInStorage);
      storePreferences(dateFormat, timeFormat);
    } else {
      handleFile();
    }
    router.push('/visualisation');
  };

  const handleDemo = () => {
    sessionStorage.setItem('chatFileContent', Demo);
    sessionStorage.setItem('dateFormat', 'dd/mm/yyyy');
    sessionStorage.setItem('timeFormat', 'hh:mm:ss');
    router.push('/visualisation');
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLLabelElement>) => {
    if (event.key === 'Enter' && chatRef.current) {
      chatRef.current.click();
    }
  };

  useEffect(() => {
    if (chatRef.current && hasFileError) {
      chatRef.current.focus();
    }
  }, [hasFileError]);

  return (
    <>
      <div className="w-full h-full bg-black">
        <nav className="flex justify-center md:justify-start">
          <Link href={'/'}>
            <Image
              src={ChatVizLogo}
              alt="ChatViz Logo"
              width="96"
              className="m-5"
            />
          </Link>
        </nav>
        <div className="flex flex-col text-center p-6 md:p-0 justify-center items-center mt-10 sm:mt-12 md:mt-36">
          <h1 className="text-[#f9fafb] text-4xl md:text-7xl tracking-tight mb-8 cursor-default">
            Let&#39;s Get Going...
          </h1>
          <h2 className="text-gray-300 font-normal text-base md:text-xl mb-6 cursor-default">
            Select your date & time formats, then upload&nbsp;your&nbsp;chat.
            <br />
            The file must be in *.txt format
          </h2>
        </div>
        <div className="flex justify-center">
          <form onSubmit={handleSubmit} className="text-white space-y-6">
            <div className="flex flex-col justify-center items-center space-y-2">
              <select
                id="dateFormat"
                name="dateFormat"
                value={dateFormat}
                required={true}
                onChange={handleDateFormatChange}
                className="text-[#f9fafb] bg-gray-800 rounded-lg"
              >
                <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                <option value="yyyy/mm/dd">YYYY/MM/DD</option>
              </select>
            </div>
            <div className="flex flex-col justify-center items-center space-y-2">
              <select
                id="timeFormat"
                name="timeFormat"
                value={timeFormat}
                required={true}
                onChange={handleTimeFormatChange}
                className="text-[#f9fafb] bg-gray-800 rounded-lg"
              >
                <option value="hh:mm:ss">24 Hour (HH:MM:SS)</option>
                <option value="hh:mm:ss a">12 Hour (HH:MM:SS AM/PM)</option>
              </select>
            </div>
            <div className="flex flex-col justify-center items-center">
              <input
                type="file"
                name="chatText"
                id="chatTextFileUpload"
                ref={chatRef}
                // required={true}
                onChange={handleFile}
                className="text-[#f9fafb] text-base font-normal"
              />
              <label
                htmlFor="chatTextFileUpload"
                id="uploadBtn"
                className={`text-[#f9fafb] text-base font-normal ${
                  hasFileError ? 'error-outline' : ''
                }`}
                tabIndex={0}
                role="button"
                onKeyDown={handleKeyPress}
                style={{}}
              >
                Upload File
              </label>
            </div>
            <div className="flex justify-center">
              <motion.button
                type="submit"
                className="glowing-button p-3 w-fit mx-auto rounded-lg bg-emerald-500 font-semibold text-xl text-[#f9fafb]"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9, backgroundColor: '#059669' }}
              >
                Visualise
              </motion.button>
            </div>
          </form>
        </div>
        <div className="text-center mt-12 md:mb-36">
          <p className="text-gray-400 font-normal text-base md:text-xl cursor-default">
            Don&#39;t have a chat?{' '}
            <span
              className="underline text-emerald-500"
              onClick={() => {
                handleDemo();
              }}
            >
              Try&nbsp;out&nbsp;the&nbsp;demo
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
