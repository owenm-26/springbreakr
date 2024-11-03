"use client";
// app/summary/page.tsx
import { useSearchParams } from "next/navigation";
import { useState } from "react";

interface MacroLocationOptions {
  country: string;
  description: string;
  status: number;
}

export default function SummaryPage() {
  const [macroLocations, setMacroLocations] = useState<
    MacroLocationOptions[] | null
  >(null);
  const searchParams = useSearchParams();

  // Retrieve the input parameter from the URL
  const summary = searchParams.get("request") || "No input provided"; // Provide a fallback
  const rawMacroLocations = JSON.parse(
    searchParams.get("recommendations") || ""
  );

  // make macro locations into objects
  if (Array.isArray(rawMacroLocations)) {
    const initialLocations: MacroLocationOptions[] = rawMacroLocations.map(
      (item: any) => ({
        country: item.country,
        description: item.description,
        status: 0, // Initialize status to 0
      })
    );
    setMacroLocations(initialLocations);
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-4xl font-bold mb-4 text-black">
        Your Spring Break Summary
      </h1>
      <p className="mb-8 text-gray-800">Here's what you want to do:</p>
      <div className="p-4 border border-gray-300 rounded-lg bg-white">
        <p className="text-lg text-black">{summary}</p>
      </div>
      <div>CARDS HERE</div>
      <button
        onClick={() => window.history.back()} // Use history to go back
        className="mt-8 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
      >
        Go Back
      </button>
    </main>
  );
}
