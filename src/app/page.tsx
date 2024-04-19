import React from 'react';
// import { createRoot } from 'react-dom/client';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import WordCloud from './TopWordsCloud'; // Make sure to import your WordCloud component
import './wordcloudStyles.css';
import AcceptFile from './AcceptFile';
import HomePage from './HomePage';

export default function Home() {
  // Creating a root for rendering the component
  // const root = createRoot(document.getElementById('root')!);

  return (
    // <ParentSize>
    //   {({ width, height }: { width: number; height: number }) => (
    //     <div style={{ width, height }}>
    //       <WordCloud width={width} height={height} />
    //     </div>
    //   )}
    // </ParentSize>
    <>
      <HomePage />
      {/* <AcceptFile /> */}
      {/* <WordCloud width={900} height={300} /> */}
    </>
  );
}
