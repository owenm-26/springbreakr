"use client";
import MacroCard from "@/components/MacroCard";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export interface MacroLocationOption {
  country: string;
  description: string;
  status: number;
  imageUrl?: string;
}

const SummaryPage = () => {
  const [macroLocations, setMacroLocations] = useState<
    MacroLocationOption[] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  const renderMacroCards = () => {
    if (loading) {
      return <p>Loading locations...</p>;
    }

    if (!macroLocations) {
      return <p>Error: We are having trouble with your request</p>;
    }

    return (
      <MacroCard
        options={macroLocations}
        onSelect={handleSelect}
        onRemove={handleRemove}
        size="large"
      />
    );
  };

  // Retrieve the input parameter from the URL
  const summary = searchParams.get("request") || "No input provided";

  // First useEffect to parse the URL parameters
  useEffect(() => {
    const initializeLocations = async () => {
      try {
        const recommendationsParam = searchParams.get("recommendations");
        if (!recommendationsParam) {
          console.error("no macro");
          setLoading(false);
          return;
        }

        let decodedJson = decodeURIComponent(recommendationsParam);
        if (!decodedJson.endsWith("]")) {
          decodedJson += "]";
        }

        const rawIdeas = JSON.parse(decodedJson);

        if (rawIdeas && Array.isArray(rawIdeas)) {
          const locationsWithPlaceholders = rawIdeas.map(
            (item: MacroLocationOption) => ({
              country: item.country,
              description: item.description,
              status: 0,
            })
          );

          // Set initial state with placeholder images
          setMacroLocations(locationsWithPlaceholders);

          // Fetch images for each location
          const updatedLocations = await Promise.all(
            locationsWithPlaceholders.map(async (location) => {
              try {
                const response = await fetch(
                  `/api/get_location_image?location=${encodeURIComponent(
                    location.country
                  )}`
                );

                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                return {
                  ...location,
                  imageUrl: data.image_url,
                };
              } catch (error) {
                console.error(
                  `Error fetching image for ${location.country}:`,
                  error
                );
                return {
                  ...location,
                  imageUrl:
                    "https://i0.wp.com/picjumbo.com/wp-content/uploads/beautiful-nature-mountain-scenery-with-flowers-free-photo.jpg?w=2210&quality=70", // Use a fallback image path
                };
              }
            })
          );

          setMacroLocations(updatedLocations);
        }
      } catch (error) {
        console.error("Error initializing locations:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeLocations();
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

    router.push(
      `/microlocations?country=${country.country}&prompt=${encodeURIComponent(
        summary
      )}`
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

  // if (loading) {
  //   return (
  //     <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
  //       <p>Loading locations...</p>
  //     </main>
  //   );
  // }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-4xl font-bold mb-4 text-black">
        Your Spring Break Summary
      </h1>
      <p className="mb-8 text-gray-800">Here is what you want to do:</p>
      <div className="p-4 border border-gray-300 rounded-lg bg-white">
        <p className="text-lg text-black">{summary}</p>
      </div>
      {renderMacroCards()}
      <button
        onClick={() => window.history.back()}
        className="mt-8 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
      >
        Go Back
      </button>
    </main>
  );
};

export default SummaryPage;