import React from 'react';
import ChatVizLogo from '../../public/ChatVizLogo.svg';
import FadedGrid from '../../public/bg-grid-2.png';
import Image from 'next/image';

const HomePage = () => {
  return (
    <div className="w-full h-full bg-gradient-to-b from-slate-950 from-10%  via-emerald-600 via-45% to-slate-950 to-99%">
      <nav className="flex justify-center md:justify-start">
        <Image
          src={ChatVizLogo}
          alt="ChatViz Logo"
          width="96"
          className="m-5"
        />
      </nav>
      <div className="pt-36 md:pt-48 flex flex-col text-center p-6 md:p-0">
        <h1 className="text-dark-tremor-content-strong font-bold text-4xl md:text-7xl tracking-tight mb-3">
          Visualise Your Dreams
        </h1>
        <h2 className="text-emerald-200 font-normal text-base md:text-xl">
          If your dream was a group chat...
        </h2>
      </div>
      <Image
        src={FadedGrid}
        alt="Faded Grid Effect"
        className="fixed bottom-0 mix-blend-screen opacity-20 pointer-events-none"
      />
      <div className="w-full">
        <div className="p-3 w-fit mx-auto rounded-lg bg-emerald-500 font-semibold text-xl mt-5">
          Get Started
        </div>
      </div>
    </div>
  );
};

export default HomePage;
