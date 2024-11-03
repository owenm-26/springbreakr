"use client";
import { useEffect, useState } from "react";

export default function ItineraryPage() {
  const [locations, setLocations] = useState<string[]>([]);
  let query;
  let country = null;
  let prompt = null;

  useEffect(() => {
    query = new URLSearchParams(window.location.search);
    const itineraryParam = query.get("plan");
    country = query.get("country");
    prompt = query.get("prompt");

    if (itineraryParam) {
      try {
        const parsedLocations = JSON.parse(decodeURIComponent(itineraryParam));
        setLocations(parsedLocations);
      } catch (error) {
        console.error("Error parsing itinerary:", error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex flex-col items-center p-8">
      <h1 className="text-4xl font-extrabold text-white mb-6 animate-bounce">
        Your Itinerary
      </h1>
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
        {locations.length > 0 ? (
          <ul className="list-disc pl-5 text-gray-800">
            {locations.map((location, index) => (
              <li
                key={index}
                className="mb-4 text-xl transition-transform transform hover:scale-105 hover:text-blue-600"
              >
                {location}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xl text-gray-600">
            No locations found in your itinerary.
          </p>
        )}
      </div>
      {locations.length > 0 && country && (
        <div className="mt-8 bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Details</h2>
          <p className="text-gray-700">
            Country: <span className="font-bold text-blue-600">{country}</span>
          </p>
          <p className="text-gray-700">
            Prompt: <span className="font-bold text-blue-600">{prompt}</span>
          </p>
        </div>
      )}
    </div>
  );
}
