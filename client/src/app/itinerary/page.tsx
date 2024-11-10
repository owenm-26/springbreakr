"use client";
// import { MacroLocationOption } from "@/components/MacroCard";
import { useEffect, useState } from "react";

export default function ItineraryPage() {
  const [locations, setLocations] = useState<string[]>([]);
  // const [macroOptions, setMacroOptions] = useState<MacroLocationOption[]>([]);

  const query = new URLSearchParams(window.location.search);
  const country = query.get("country");

  useEffect(() => {
    setLocations([]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex flex-col items-center p-8">
      <h1 className="text-4xl font-extrabold text-white mb-6 animate-bounce">
        Your Itinerary
      </h1>

      {locations.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Details</h2>
          <p className="text-gray-700">
            Country: <span className="font-bold text-blue-600">{country}</span>
          </p>
        </div>
      )}
    </div>
  );
}
