'use client';

import Link from 'next/link';
import Image from 'next/image';
import ChatVizLogo from '../../public/ChatVizLogo.svg';

export default function Error() {
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
            Uh Ohhh...
          </h1>
          <h2 className="text-gray-300 font-normal text-base md:text-xl mb-6 cursor-default">
            Something wrong happened :&nbsp;&#40;
            <br />
            But there&#39;s no need to panic
          </h2>
          <h3 className="text-gray-300 font-normal text-base md:text-xl mb-6 cursor-default">
            Let&#39;s get this right shall we...
          </h3>
          <ul className="mt-4">
            <li className="text-gray-300 font-normal text-base md:text-xl cursor-default mb-4">
              1. Your file has to be in *.txt&nbsp;format
              <br />
              <p className="text-red-500">
                Unzip the chat file before uploading
              </p>
            </li>
            <li className="text-gray-300 font-normal text-base md:text-xl cursor-default mb-4">
              2. The file must be exported directly from&nbsp;Whatsapp
            </li>
            <li className="text-gray-300 font-normal text-base md:text-xl cursor-default mb-4">
              <p className="text-red-500">
                3. Make sure the correct date and time formats
                have&nbsp;been&nbsp;selected
              </p>
            </li>
            <li className="text-gray-300 font-normal text-base md:text-xl cursor-default mb-4">
              4. If you&#39;re sure you&#39;ve got steps 1-3 down
              you&nbsp;can&nbsp;
              <Link href={'/upload'} className="underline text-emerald-300">
                try&nbsp;again
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
