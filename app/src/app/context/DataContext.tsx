"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface ApiResponse {
  responses: {
    model: string;
    content: string;
    citations: string[];
  }[];
}

interface DataContextType {
  data: ApiResponse | null;
  setData: React.Dispatch<React.SetStateAction<ApiResponse | null>>;
  userQuestion: string;
  setUserQuestion: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  questionHistory: string[];
  setQuestionHistory: React.Dispatch<React.SetStateAction<string[]>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [userQuestion, setUserQuestion] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [questionHistory, setQuestionHistory] = useState<string[]>([]);

  return (
    <DataContext.Provider
      value={{
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
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export const useMediaQuery = ({ query }: { query: string }) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

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
