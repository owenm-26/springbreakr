"use client";
import MacroCard, { MacroLocationOption } from "@/components/MacroCard";
import { useEffect, useState } from "react";

export default function ItineraryPage() {
  const [locations, setLocations] = useState<string[]>([]);
  const [macroOptions, setMacroOptions] = useState<MacroLocationOption[]>([]);
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

        // Create MacroLocationOption objects based on parsedLocations
        const options = parsedLocations.map((location: string) => ({
          country: location,
          description: `${location} is a beautiful place to explore.`,
          status: 0,
          imageUrl:
            "https://i0.wp.com/picjumbo.com/wp-content/uploads/beautiful-nature-mountain-scenery-with-flowers-free-photo.jpg?w=2210&quality=70",
        }));
        setMacroOptions(options);
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

      {/* Mini Cards Section */}
      {macroOptions.length > 0 && (
        <div className="flex-grow mt-8 w-full bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Explore Locations
          </h2>
          <div className="h-2/3 w-full overflow-y-auto">
            <MacroCard
              options={macroOptions}
              onSelect={() => console.log("Selected:", location)}
              onRemove={() => console.log("Removed:", location)}
              size="mini"
            />
          </div>
        </div>
      )}
    </div>
  );
}
