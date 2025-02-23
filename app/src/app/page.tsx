"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { RingLoader } from "react-spinners";
import ModelResultsTile from "./components/ModelResultsSlider";

export interface ApiResponse {
  responses: {
    model: string;
    content: string;
    citations: string[];
  }[];
}

function useMediaQuery({ query }: { query: string }) {
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
}

const Home = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [userQuestion, setUserQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      console.log("data", data);
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
    <div className="h-full">
      {loading && (
        <div className="flex flex-col gap-6 justify-center items-center h-screen">
          <RingLoader color={"white"} loading={loading} size={70} />
          <p className="text-white">Fetching Results...</p>{" "}
        </div>
      )}

      <div className="bg-white flex items-center text-center justify-between px-5 py-8 sm:px-12">
        <Image
          src="/public/images/placeholder_logo.png"
          alt="logo"
          width={50}
          height={50}
          style={{ backgroundColor: "#4B9CD3" }}
        />
        <h1 className="font-bold text-[#d15700] flex w-full sm:py-4 sm:h-24 pl-6 sm:pl-12 items-center text-4xl xl:text-6xl">
          Seeker <span className="italic">AI</span>
        </h1>
      </div>
      <div className="sm:px-12 pb-8 bg-white">
        <div className="w-full h-fit flex flex-col px-4 pb-4 rounded-xl bg-white">
          <label className="flex flex-col mt-4"></label>
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
        </div>
      </div>
      {data && <ModelResultsTile data={data?.responses || []} />}
    </div>
  );
};

export default Home;
