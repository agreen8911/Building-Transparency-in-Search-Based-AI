"use client";

import Image from "next/image";
import { RingLoader } from "react-spinners";
import ModelResultsTile from "./components/ModelResultsSlider";
import Link from "next/link";
import { useData, useMediaQuery } from "./context/DataContext";

const Home = () => {
  const {
    data,
    setData,
    userQuestion,
    setUserQuestion,
    loading,
    setLoading,
    error,
    setError,
    questionHistory,
    setQuestionHistory,
  } = useData();

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

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

  const fetchData = async () => {
    setLoading(true);
    try {
      if (
        userQuestion.trim() &&
        (questionHistory.length === 0 || questionHistory[0] !== userQuestion)
      ) {
        setQuestionHistory((prev) => [userQuestion, ...prev.slice(0, 4)]);
      }

      const response = await fetch(`http://localhost:8000/api/chat/all`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messages,
        }),
      });

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

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div
      className={`min-h-screen ${
        data && !loading ? "bg-[#0b5394]" : "bg-white flex flex-col"
      }`}
    >
      {loading ? (
        <div className="flex flex-col gap-6 justify-center items-center h-screen">
          <RingLoader color={"#0b5394"} loading={loading} size={70} />
          <p className="text-[#0b5394]">
            Fetching data...
          </p>
        </div>
      ) : !data ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-4xl px-4">
            <div className="bg-white flex flex-col gap-8 sm:flex-row items-center text-center justify-between py-8">
              <div className="flex items-center">
                <Image
                  src="/images/seekerai_logo.png"
                  alt="logo"
                  className="hidden sm:block"
                  width={70}
                  height={70}
                />
                <h1 className="font-bold text-[#d15700] flex w-fit pl-2 items-center text-4xl sm:text-5xl xl:text-6xl">
                  Seeker<span className="italic">AI</span>
                </h1>
              </div>
              <Link
                href="/visualization"
                className="text-white w-4/5 p-2 text-xs sm:text-base font-semibold font-sans bg-[#0b5394] sm:w-1/3 xl:w-fit xl:p-4 rounded-xl shadow-2xl flex items-center justify-center"
              >
                Evolution of Information Visualization
                <span className="ml-2 text-lg">→</span>
              </Link>
            </div>
            <div className="pb-8 mt-8">
              <div className="w-full h-fit flex flex-col pb-4 rounded-xl">
                <div className="relative shadow-xl shadow-b-2xl">
                  <input
                    type="text"
                    className="w-full border text-black rounded-lg border-black pl-2 pr-8 sm:px-6 bg-white placeholder:flex placeholder:items-center placeholder:italic h-12 leading-4 placeholder-wrap break-words"
                    placeholder={
                      isMobile
                        ? "Got a question?..."
                        : "Got a question? See how different models respond and check the information source..."
                    }
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        fetchData();
                        setUserQuestion("");
                      }
                    }}
                  />
                  <button
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                    onClick={() => setUserQuestion("")}
                  >
                    ✕
                  </button>
                </div>

                {questionHistory.length > 0 && (
                  <div className="mt-4 p-2 bg-gray-50 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm text-gray-500 font-medium">
                        Recent questions:
                      </h4>
                      <button
                        onClick={() => setQuestionHistory([])}
                        className="text-xs text-[#0b5394] hover:text-[#084378] font-medium"
                      >
                        Clear History
                      </button>
                    </div>
                    <ul className="space-y-1">
                      {questionHistory.map((question, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-700 cursor-pointer hover:bg-gray-100 p-1 rounded"
                          onClick={() => {
                            setUserQuestion(question);
                          }}
                        >
                          {question}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white flex flex-col gap-8 sm:flex-row items-center text-center justify-between px-5 py-8 sm:px-12">
            <div className="flex items-center">
              <Image
                src="/images/seekerai_logo.png"
                alt="logo"
                className="hidden sm:block"
                width={70}
                height={70}
              />
              <h1 className="font-bold text-[#d15700] flex w-fit pl-2 sm:py-4 sm:h-24 items-center text-4xl sm:text-5xl xl:text-6xl">
                Seeker<span className="italic">AI</span>
              </h1>
            </div>
            <Link
              href="/visualization"
              className="text-white w-4/5 p-2 text-xs sm:text-base font-semibold font-sans bg-[#0b5394] sm:w-1/3 xl:w-fit xl:p-4 rounded-xl shadow-2xl flex items-center justify-center"
            >
              Evolution of Information Visualization
              <span className="ml-2 text-lg">→</span>
            </Link>
          </div>
          <div className="sm:px-12 pb-8 bg-white">
            <div className="w-full h-fit flex flex-col pb-4 rounded-xl bg-white">
              <label className="flex flex-col sm:mt-4" />
              <div className="relative shadow-xl shadow-b-2xl">
                <input
                  type="text"
                  className="w-full border text-black rounded-lg border-black pl-2 pr-8 sm:px-6 bg-white placeholder:flex placeholder:items-center placeholder:italic h-12 leading-4 placeholder-wrap break-words"
                  placeholder={
                    isMobile
                      ? "Got a question?..."
                      : "Got a question? See how different models respond and check the information source..."
                  }
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      fetchData();
                      setUserQuestion("");
                    }
                  }}
                />
                <button
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  onClick={() => setUserQuestion("")}
                >
                  ✕
                </button>
              </div>

              {questionHistory.length > 0 && (
                <div className="mt-4 p-2 bg-gray-50 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm text-gray-500 font-medium">
                      Recent questions:
                    </h4>
                    <button
                      onClick={() => setQuestionHistory([])}
                      className="text-xs text-[#0b5394] hover:text-[#084378] font-medium"
                    >
                      Clear History
                    </button>
                  </div>
                  <ul className="space-y-1">
                    {questionHistory.map((question, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-700 cursor-pointer hover:bg-gray-100 p-1 rounded"
                        onClick={() => {
                          setUserQuestion(question);
                        }}
                      >
                        {question}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <ModelResultsTile data={data?.responses || []} />
        </>
      )}
    </div>
  );
};

export default Home;
