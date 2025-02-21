import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface modelResponseResults {
  model: string;
  content: string;
  citations: string[];
}

interface ModelResultsSliderProps {
  data: modelResponseResults[];
}

const ModelResultsSlider = ({ data }: ModelResultsSliderProps) => {
  // console.log("data", data);
  const [expandedStates, setExpandedStates] = useState<boolean[]>(
    new Array(data.length).fill(false)
  );

  const toggleExpanded = (index: number) => {
    const newStates = [...expandedStates];
    newStates[index] = !newStates[index];
    setExpandedStates(newStates);
  };

  const formatLinks = (text: string) => {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlPattern, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="text-decoration: underline;">${url}</a>`;
    });
  };

  const formatText = (text: string | "") => {
    // Convert text into an array of paragraphs and format
    return text?.split("\n").map((paragraph, index) => {
      // Handle bullet points
      if (paragraph.startsWith("- ")) {
        const listItem = paragraph.slice(2); // Remove the '- ' prefix
        return (
          <li
            key={index}
            dangerouslySetInnerHTML={{ __html: formatLinks(listItem) }}
          />
        );
      }

      if (paragraph.startsWith("#### ")) {
        return (
          <h4
            key={index}
            className="text-normal text-red-200 my-2 font-semibold"
          >
            {paragraph.slice(5)}
          </h4>
        );
      }

      // Handle headings (indicated by ###)
      if (paragraph.startsWith("### ")) {
        return (
          <h3 key={index} className="text-xl my-2 font-semibold">
            {paragraph.slice(4)}
          </h3>
        );
      }

      // Handle subheadings (indicated by ##)
      if (paragraph.startsWith("## ")) {
        return (
          <h2 key={index} className="text-lg font-bold">
            {paragraph.slice(3)}
          </h2>
        );
      }

      return (
        <p
          key={index}
          dangerouslySetInnerHTML={{ __html: formatLinks(paragraph) }}
        />
      );
    });
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: true,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="w-full h-full px-12 py-8">
      <Slider {...settings}>
        {data.map((response, index) => (
          <div key={index} className="px-2 min-h-96">
            <div className="bg-white rounded-lg shadow-2xl p-4 overflow-scroll">
              <h3 className="text-black font-semibold text-4xl text-center">
                {response.model}
              </h3>
              <div className="p-4 relative h-full flex flex-col justify-between">
                <div>
                  <div className="flex flex-col items-center font-bold text-[#d15700] text-2xl p-5">
                    <h3>Trust Score</h3>
                    <p>14</p>
                  </div>
                  <p className="mt-4 font-bold mb-4 text-base">
                    Number of Sources: {response.citations?.length || 0}
                  </p>
                  {response.citations && (
                    <>
                      <p className="font-bold text-sm">Cited Sources:</p>
                      <ul className="mt-2 text-xs">
                        {response.citations.map((citation, citIndex) => (
                          <li key={citIndex} className="text-blue-800">
                            <a
                              href={citation}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="cursor-pointer"
                            >
                              [{citIndex + 1}]
                            </a>{" "}
                            {citation}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
                <div className="relative">
                  <div
                    className={`overflow-hidden ${
                      !expandedStates[index] ? "max-h-20" : ""
                    } ${
                      !expandedStates[index]
                        ? "after:absolute after:bottom-0 after:left-0 after:h-full after:w-full after:bg-gradient-to-t after:from-white after:via-white/10 after:to-transparent"
                        : ""
                    }`}
                  >
                    {formatText(response.content || "")}
                  </div>
                </div>
                {response.content && (
                  <button
                    onClick={() => toggleExpanded(index)}
                    className="text-left text-sm underline relative z-10 text-[#0b5394] font-semibold"
                  >
                    {expandedStates[index]
                      ? "Show less"
                      : "+ View Full Response..."}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ModelResultsSlider;
