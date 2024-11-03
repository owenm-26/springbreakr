"use client";
import MacroCard from "@/components/MacroCard";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export interface MacroLocationOption {
  country: string;
  description: string;
  status: number;
  imageUrl: string;
}

export default function SummaryPage() {
  const [macroLocations, setMacroLocations] = useState<
    MacroLocationOption[] | null
  >(null);
  const searchParams = useSearchParams();

  // Retrieve the input parameter from the URL
  const summary = searchParams.get("request") || "No input provided";

  useEffect(() => {
    try {
      const recommendationsParam = searchParams.get("recommendations");
      if (!recommendationsParam) {
        console.error("no macro");
        return;
      }

      const decodedJson = decodeURIComponent(recommendationsParam);
      // const decodedJson = fixAndParseJSON(decodedJson);
      const rawIdeas = JSON.parse(decodedJson);

      if (rawIdeas) {
        const initialLocations: MacroLocationOption[] = rawIdeas.map(
          (item: any) => ({
            country: item.country,
            description: item.description,
            status: 0,
            imageUrl: "FIX LATER",
          })
        );
        setMacroLocations(initialLocations);
      }
    } catch (error) {
      console.error("Error initializing locations:", error);
    }
  }, [searchParams]);

  const handleSelect = (country: MacroLocationOption) => {
    if (!macroLocations) return;

    setMacroLocations(
      (prevLocations) =>
        prevLocations?.map((location) =>
          location.country === country.country
            ? { ...location, status: 2 }
            : location
        ) || null
    );
  };

  const handleRemove = (country: MacroLocationOption) => {
    if (!macroLocations) return;

    setMacroLocations(
      (prevLocations) =>
        prevLocations?.map((location) =>
          location.country === country.country
            ? { ...location, status: 1 }
            : location
        ) || null
    );
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-4xl font-bold mb-4 text-black">
        Your Spring Break Summary
      </h1>
      <p className="mb-8 text-gray-800">Here's what you want to do:</p>
      <div className="p-4 border border-gray-300 rounded-lg bg-white">
        <p className="text-lg text-black">{summary}</p>
      </div>
      {macroLocations ? (
        <MacroCard
          options={macroLocations}
          onSelect={handleSelect}
          onRemove={handleRemove}
        />
      ) : (
        <p>Error: We are having trouble with your request</p>
      )}
      <button
        onClick={() => window.history.back()}
        className="mt-8 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
      >
        Go Back
      </button>
    </main>
  );
}