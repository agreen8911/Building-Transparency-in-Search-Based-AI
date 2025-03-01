"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

const Visualization = () => {
  const useMediaQuery = ({ query }: { query: string }) => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
      const mediaQuery = window.matchMedia(query);
      const handler = (event: MediaQueryListEvent) => setMatches(event.matches);

      setMatches(mediaQuery.matches);
      mediaQuery.addEventListener("change", handler);

      return () => {
        mediaQuery.removeEventListener("change", handler);
      };
    }, [query]);

    return matches;
  };

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <div className="flex flex-col w-full h-max">
      <div className="bg-white flex text-[#0b5394] gap-2 sm:gap-0 justify-center px-2 py-4 sm:p-10 relative">
        {!isMobile && (
          <Link
            href="/"
            className="sm:absolute bg-[#0b5394] font-semibold font-serif text-white py-2 px-3 sm:p-3 top-3 sm:top-10 min-w-fit text-xs sm:min-w-40 text-center rounded-xl sm:left-4 xl:left-10"
          >
            Back to Model Results
          </Link>
        )}
        <h1 className="text-lg sm:text-3xl font-serif">
          Four Industrial Revolutions
        </h1>
      </div>
      <div className="w-full h-72 sm:h-5/6 flex flex-col p-2 mt-8 bg-[#0b5394]">
        <iframe
          title="A Historical Perspective"
          className="w-full flex-grow py-2 sm:py-4"
          style={{ height: "50vh", border: 0 }}
          src="https://app.powerbi.com/view?r=eyJrIjoiOWExNWNhMGYtYjAwMy00Nzk1LThkMDYtMDk2OTAxZDA1NmI3IiwidCI6ImNiNTI5ZDExLWU2Y2MtNDdiYy1hMjFmLWViYzA1OTYyNzA0NyIsImMiOjF9"
          allowFullScreen={true}
        />
      </div>
      {isMobile && (
        <Link
          href="/"
          className="bg-white w-3/4 font-semibold font-serif text-[#0b5394] py-2 px-3 text-xs text-center rounded-xl mx-auto mt-8"
        >
          Back to Model Results
        </Link>
      )}
    </div>
  );
};

export default Visualization;
