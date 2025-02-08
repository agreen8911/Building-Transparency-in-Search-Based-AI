"use client";

import { useState } from "react";
import { RingLoader } from "react-spinners";

interface ApiResponse {
  content: string;
  citations: string[];
}

const Home = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [userQuestion, setUserQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const messages = [
    {
      role: "system",
      content:
        "You are an artificial intelligence assistant and you need to engage in a helpful, detailed, polite conversation with a user.",
    },
    {
      role: "user",
      content: `${userQuestion}`,
    },
  ];

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

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        // "http://localhost:5000/api/chat/gemini",
        // "http://localhost:5000/api/chat/perplexity",
        "http://localhost:5000/api/chat/all",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: messages,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch response");
      }
      setData(data);
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  console.log("data", data);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 justify-center items-center">
        <RingLoader color={"#123abc"} loading={loading} size={70} />
        <p>Fetching Results...</p>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="pb-12">
      <h1 className="font-bold text-black  border-black flex w-full h-24 justify-center items-center border text-3xl">
        Trust but Verify AI
      </h1>
      <div className="px-12 py-10 flex-1">
        <section className="w-full h-full flex flex-col gap-4 border border-gray-500 p-6">
          <div className="w-full h-fit flex flex-col border border-black p-4 rounded-xl bg-white">
            <label className="flex flex-col mt-4">
              <div className="mb-4">
                <span className="ml-2 text-black">
                  Got a question? See how different models respond and check the
                  information source.
                </span>
              </div>
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full border text-black rounded-lg border-black px-2 sm:px-6 py-2 bg-white placeholder:flex placeholder:items-center h-16 leading-4 placeholder-wrap break-words"
                placeholder="What is the largest aquarium in the world..."
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
              />

              <button
                className="absolute right-3 top-5 text-gray-500 hover:text-gray-700"
                onClick={() => setUserQuestion("")}
              >
                ✕
              </button>
            </div>
            <label className="flex flex-col mt-4"></label>
            <button
              className={`h-12 rounded-lg ${
                userQuestion
                  ? "bg-white text-black cursor-pointer border border-black"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              onClick={async () => {
                await fetchData();
                setUserQuestion("");
              }}
              disabled={userQuestion === ""}
            >
              Submit
            </button>
          </div>
        </section>
      </div>
      {data && (
        <div className="mx-12 flex flex-col sm:grid sm:grid-cols-2 xl:grid-cols-6 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-2xl p-4 hover:scale-105 transform transition duration-200 h-96">
            <h3 className="text-black font-semibold text-xl text-center">
              Model 1
            </h3>
            {data && (
              <div className="p-4 relative h-full flex flex-col justify-between">
                <div className="relative">
                  <div
                    className={`overflow-hidden ${
                      !isExpanded ? "max-h-20" : ""
                    } ${
                      !isExpanded
                        ? "after:absolute after:bottom-0 after:left-0 after:h-full after:w-full after:bg-gradient-to-t after:from-white after:via-white/10 after:to-transparent"
                        : ""
                    }`}
                  >
                    {formatText(data.content)}
                  </div>
                </div>
                {data.content && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-left text-sm underline relative z-10"
                  >
                    {isExpanded ? "Show less" : "Show more..."}
                  </button>
                )}
                <div>
                  <p className="mt-4 font-bold underline text-sm">
                    Sources ({data.citations.length})
                  </p>
                  {data.citations && (
                    <ul className="mt-2 text-xs">
                      {data.citations.map((citation, index) => {
                        return (
                          <li
                            key={index}
                            dangerouslySetInnerHTML={{
                              __html: formatLinks(`[${index + 1}] ${citation}`),
                            }}
                            className="text-blue-800"
                          />
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="border-blue-700 border-2">Model 2</div>
          <div className="bg-white border-2 border-blue-700 rounded-lg shadow-lg p-4 hover:scale-105 transform transition duration-200">
            <h3 className="text-blue-700 font-semibold text-xl text-center">
              Model 1
            </h3>
            {data && (
              <div className="p-4 relative">
                <div className="relative">
                  <div
                    className={`overflow-hidden ${
                      !isExpanded ? "max-h-20" : ""
                    } ${
                      !isExpanded
                        ? "after:absolute after:bottom-2 after:left-0 after:h-full after:w-full after:bg-gradient-to-t after:from-white after:via-white/70 after:to-transparent"
                        : ""
                    }`}
                  >
                    {formatText(data.content)}
                  </div>
                </div>
                {data.content && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-sm underline relative z-10"
                  >
                    {isExpanded ? "Show less" : "Show more..."}
                  </button>
                )}
                <div>
                  <p className="mt-4 font-bold">Sources:</p>
                  {data.citations && (
                    <ul className="mt-2 text-xs">
                      {data.citations.map((citation, index) => {
                        return (
                          <li
                            key={index}
                            dangerouslySetInnerHTML={{
                              __html: formatLinks(`[${index + 1}] ${citation}`),
                            }}
                            className="text-blue-800"
                          />
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="border-red-700 border-2">Model 3</div>
          <div className="border-orange-700 border-2">Model 4</div>
          <div className="border-gray-700 border-2">Model 5</div>
          <div className="border-purple-700 border-2">Model 6</div>
        </div>
      )}
      <RingLoader color={"#123abc"} loading={loading} size={150} />
    </div>
  );
};

export default Home;
