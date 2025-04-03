import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useMediaQuery } from "../context/DataContext";

interface modelResponseResults {
  model: string;
  content: string;
  citations: string[] | { uri: string; title: string }[];
}

const extractDomain = (url: string): string => {
  let formattedUrl = url;
  if (!/^https?:\/\//i.test(url)) {
    formattedUrl = `https://${url}`;
  }
  try {
    const domain = new URL(formattedUrl).hostname;
    const parts = domain.split(".");
    return parts.slice(-2).join(".");
  } catch {
    return url;
  }
};

const calculateTrustScore = (response: modelResponseResults) => {
  let trustScore = 0;

  if (response.citations.length > 0) {
    trustScore += 5;
    const uniqueDomains = new Set(
      response.citations.map((citation) => {
        if (typeof citation === "string") {
          return extractDomain(citation);
        } else if (citation.title) {
          // Use the title for citation objects
          return extractDomain(citation.title);
        }
        return "";
      })
    );
    trustScore += uniqueDomains.size;
  }

  return trustScore;
};

interface modelResponseResults {
  model: string;
  content: string;
  citations: string[] | { uri: string; title: string }[];
}

interface ModelResultsSliderProps {
  data: modelResponseResults[];
}

const ModelResultsSlider = ({ data }: ModelResultsSliderProps) => {
  const [expandedStates, setExpandedStates] = useState<boolean[]>(
    new Array(data.length).fill(false)
  );
  const [showModal, setShowModal] = useState(false);

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const TrustScoreModal = () => (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={() => setShowModal(false)}
      ></div>
      <div className="bg-white rounded-lg p-6 shadow-xl z-10 max-w-xl">
        <h3 className="text-xl font-bold mb-3 text-[#0b5394]">
          Trust Score Explained
        </h3>
        <p className="mb-4">
          To help users verify the accuracy of the information returned for
          their questions, we created a &apos;Trust Score&apos;.
        </p>
        <p className="mb-2">A trust score is calculated based on:</p>
        <ul className="mb-4 list-disc pl-5">
          <li className="mb-1">
            Number of citations provided (5 points if citations are provided)
          </li>
          <li className="mb-1">
            Diversity of sources (1 point per unique domain)
          </li>
        </ul>
        <p className="mb-4">
          Higher scores suggest more verifiable information with diverse
          sources.
        </p>
        <button
          onClick={() => setShowModal(false)}
          className="bg-[#0b5394] text-white px-4 py-2 rounded-lg hover:bg-[#084378] transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );

  const toggleExpanded = (index: number) => {
    const newStates = [...expandedStates];
    newStates[index] = !newStates[index];
    setExpandedStates(newStates);
  };

  const formatLinks = (text: string) => {
    // Format URLs to clickable links
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlPattern, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="text-decoration: underline;">${url}</a>`;
    });
  };

  const formatBoldText = (text: string) => {
    let formattedText = text;
    formattedText = formattedText.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>"
    );

    return formattedText;
  };

  const formatText = (text: string | "") => {
    // Convert text into an array of paragraphs and format
    return text?.split("\n").map((paragraph, index) => {
      // Apply bold formatting first
      paragraph = formatBoldText(paragraph);

      // Handle bullet points with hyphen (-)
      if (paragraph.startsWith("- ")) {
        const listItem = paragraph.slice(2); // Remove the '- ' prefix
        return (
          <li
            key={index}
            dangerouslySetInnerHTML={{ __html: formatLinks(listItem) }}
          />
        );
      }

      // Handle bullet points with asterisk (*)
      if (paragraph.startsWith("* ")) {
        const listItem = paragraph.slice(2); // Remove the '* ' prefix
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
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          arrows: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
          arrows: true,
        },
      },
    ],
  };

  return (
    <div className="flex flex-col gap-10 sm:block w-full px-5 sm:px-12 py-10 sm:py-20">
      {showModal && <TrustScoreModal />}

      {isMobile ? (
        data.map((response, index) => (
          <div key={index} className="px-2 sm:min-h-[300px]">
            <div className="bg-white rounded-lg shadow-2xl p-4 h-[400px] sm:h-[300px] overflow-scroll">
              <h3 className="text-black font-semibold text-4xl text-center">
                {response.model}
              </h3>
              <div className="p-4 relative h-full flex flex-col gap-4">
                <div>
                  <div className="w-full flex flex-col justify-between items-center">
                    <div className="flex flex-col items-center justify-center font-bold bg-[#d15700] text-white w-fit text-2xl p-5 rounded-3xl">
                      <h3>Trust Score</h3>
                      <h3>{calculateTrustScore(response)}</h3>
                      <p
                        className="text-sm cursor-pointer hover:underline"
                        onClick={() => setShowModal(true)}
                      >
                        What is a trust score?
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 font-bold mb-4 text-base">
                    Number of Sources: {response.citations?.length || 0}
                  </p>
                  {response.citations && (
                    <>
                      <p className="font-bold text-sm">Cited Sources:</p>
                      <ul className="mt-2 text-xs">
                        {response.citations.map(
                          (
                            citation: string | { uri: string; title: string },
                            citIndex
                          ) => (
                            <li
                              key={citIndex}
                              className="text-blue-800 hover:underline mb-1"
                            >
                              {typeof citation === "string" ? (
                                <a
                                  href={citation}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="cursor-pointer inline-block w-full"
                                >
                                  [{citIndex + 1}] {citation}
                                </a>
                              ) : (
                                <a
                                  href={citation.uri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="cursor-pointer inline-block w-full"
                                >
                                  [{citIndex + 1}] {citation.title}
                                </a>
                              )}
                            </li>
                          )
                        )}
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
        ))
      ) : (
        <Slider {...settings}>
          {data.map((response, index) => (
            <div key={index} className="px-2 min-h-[600px]">
              <div className="bg-white rounded-lg shadow-2xl p-4 h-[600px] overflow-scroll">
                <h3 className="text-black font-semibold text-4xl text-center">
                  {response.model}
                </h3>
                <div className="p-4 relative h-full flex flex-col gap-4">
                  <div>
                    <div className="w-full flex flex-col justify-between items-center">
                      <div className="flex flex-col items-center justify-center font-bold bg-[#d15700] text-white w-fit text-2xl p-5 rounded-3xl sm:w-1/3">
                        <h3>Trust Score</h3>
                        <h3>{calculateTrustScore(response)}</h3>
                        <p
                          className="text-sm cursor-pointer hover:underline"
                          onClick={() => setShowModal(true)}
                        >
                          What is a trust score?
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 font-bold mb-4 text-base">
                      Number of Sources: {response.citations?.length || 0}
                    </p>
                    {response.citations && (
                      <>
                        <p className="font-bold text-sm">Cited Sources:</p>
                        <ul className="mt-2 text-xs">
                          {response.citations.map(
                            (
                              citation: string | { uri: string; title: string },
                              citIndex
                            ) => (
                              <li
                                key={citIndex}
                                className="text-blue-800 hover:underline mb-1"
                              >
                                <a
                                  href={
                                    typeof citation === "string"
                                      ? citation
                                      : citation.uri
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="cursor-pointer inline-block w-full"
                                >
                                  [{citIndex + 1}]{" "}
                                  {typeof citation === "string"
                                    ? citation
                                    : citation.title}
                                </a>
                              </li>
                            )
                          )}
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
      )}
    </div>
  );
};

export default ModelResultsSlider;
