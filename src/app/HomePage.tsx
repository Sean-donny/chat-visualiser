'use client';
import React, { useEffect, useState } from 'react';
import ChatVizLogo from '../../public/ChatVizLogo.svg';
import Image from 'next/image';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Link from 'next/link';

const HomePage = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 400);
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderWord = (word: string) => {
    return word.split('').map((letter, index) => (
      <span key={index} className="fancy-hero-letter">
        {letter}
      </span>
    ));
  };

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const defaultBallRadius = 20;

  const [ballRadius, setBallRadius] = useState(defaultBallRadius);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - ballRadius);
      cursorY.set(e.clientY - ballRadius);
    };

    window.addEventListener('mousemove', moveCursor);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, [ballRadius, cursorX, cursorY]);

  return (
    <div className="w-full h-full bg-black">
      <nav className="flex justify-center md:justify-start">
        <Image
          src={ChatVizLogo}
          alt="ChatViz Logo"
          width="96"
          className="m-5"
          onMouseEnter={() => {
            setBallRadius(125);
          }}
          onMouseLeave={() => {
            setBallRadius(defaultBallRadius);
          }}
        />
      </nav>
      <div className="pt-36 md:pt-48 flex flex-col text-center p-6 md:p-0">
        <motion.h1
          className="text-[#f9fafb] text-4xl md:text-7xl tracking-tight mb-4 cursor-default"
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 2,
            ease: 'easeInOut',
            times: [0, 0.5, 1],
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
        >
          <span
            className={`fancy-hero-word ${isSmallScreen ? 'block' : 'inline'}`}
            onMouseEnter={() => {
              setBallRadius(80);
            }}
            onMouseLeave={() => {
              setBallRadius(defaultBallRadius);
            }}
          >
            {renderWord('Visualise')}
          </span>
          <span
            className={`fancy-hero-word ${isSmallScreen ? 'block' : 'inline'}`}
            onMouseEnter={() => {
              setBallRadius(80);
            }}
            onMouseLeave={() => {
              setBallRadius(defaultBallRadius);
            }}
          >
            &nbsp;{renderWord('Your')}&nbsp;
            {/* </span>
          <span
            className={`fancy-hero-word ${isSmallScreen ? 'block' : 'inline'}`}
          > */}
            {renderWord('Dreams')}
          </span>
        </motion.h1>
        <h2 className="glowing-text text-gray-300 font-normal text-base md:text-xl mb-6 cursor-default">
          <span
            onMouseEnter={() => {
              setBallRadius(30);
            }}
            onMouseLeave={() => {
              setBallRadius(defaultBallRadius);
            }}
          >
            If your dream was a group chat...
          </span>
        </h2>
      </div>
      <div className="glowing-button-parent w-full">
        <Link href={'/upload'}>
          <motion.button
            className="glowing-button p-3 w-fit mx-auto rounded-lg bg-emerald-500 font-semibold text-xl text-[#f9fafb]"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9, backgroundColor: '#059669' }}
            onMouseEnter={() => {
              setBallRadius(0);
            }}
            onMouseLeave={() => {
              setBallRadius(defaultBallRadius);
            }}
          >
            Get Started
          </motion.button>
        </Link>
      </div>
      <motion.div
        className="torchlight"
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 999,
          pointerEvents: 'none',
          mixBlendMode: 'screen',
        }}
        animate={{
          width: ballRadius * 2,
          height: ballRadius * 2,
          borderRadius: ballRadius,
        }}
      />
    </div>
  );
};

export default HomePage;
