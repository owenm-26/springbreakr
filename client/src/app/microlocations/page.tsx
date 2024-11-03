"use client";
import { useRouter, useSearchParams } from "next/navigation";
import MacroCard, { MacroLocationOption } from "@/components/MacroCard";
import { useEffect, useState, useCallback } from "react";
import { Button } from "antd";

export interface MicroLocation {
  location: string;
  description: string;
}

export default function MicroLocationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const location = searchParams.get("country");
  const prompt = searchParams.get("prompt");

  const [microLocations, setMicroLocations] = useState<
    MacroLocationOption[] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMicroLocations = useCallback(async () => {
    if (!location || !prompt) {
      setLoading(false);
      setError("Missing required parameters");
      return;
    }

    try {
      const response = await fetch(
        `/api/get_micro_recommendations?country=${encodeURIComponent(
          location
        )}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      if (data.recommendation) {
        const locations = JSON.parse(data.recommendation).map(
          (item: MicroLocation) => ({
            country: item.location,
            description: item.description,
            status: 0,
            imageUrl: null, // Initialize imageUrl
          })
        );

        // Fetch images for each location
        const locationsWithImages = await Promise.all(
          locations.map(async (location: MacroLocationOption) => {
            try {
              const imageResponse = await fetch(
                `/api/get_location_image?location=${encodeURIComponent(
                  location.country
                )}`
              );

              if (!imageResponse.ok) {
                throw new Error(`HTTP error! status: ${imageResponse.status}`);
              }

              const imageData = await imageResponse.json();
              return {
                ...location,
                imageUrl:
                  imageData.image_url || "https://default-image-url.jpg", // Fallback image URL
              };
            } catch (error) {
              console.error(
                `Error fetching image for ${location.country}:`,
                error
              );
              return {
                ...location,
                imageUrl: "https://default-image-url.jpg", // Fallback image URL
              };
            }
          })
        );

        setMicroLocations(locationsWithImages);
      } else {
        throw new Error("No recommendations received");
      }
    } catch (error) {
      console.error("Failed to fetch micro recommendations:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch locations"
      );
    } finally {
      setLoading(false);
    }
  }, [location, prompt]);

  useEffect(() => {
    fetchMicroLocations();
  }, [fetchMicroLocations]);

  const handleSelect = useCallback((selectedLocation: MacroLocationOption) => {
    setMicroLocations((prevLocations) => {
      if (!prevLocations) return null;
      return prevLocations.map((location) =>
        location.country === selectedLocation.country
          ? { ...location, status: 2 }
          : location
      );
    });
  }, []);

  const handleRemove = useCallback((removedLocation: MacroLocationOption) => {
    setMicroLocations((prevLocations) => {
      if (!prevLocations) return null;
      return prevLocations.map((location) =>
        location.country === removedLocation.country
          ? { ...location, status: 1 }
          : location
      );
    });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
        <div className="animate-pulse text-lg">Loading locations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Button
        onClick={() => {
          const selectedCountries =
            microLocations
              ?.filter((location) => location.status !== 2)
              .map((location) => location.country) || [];
          const url = `/itinerary?country=${location}&prompt=${encodeURIComponent(
            prompt || ""
          )}&plan=${encodeURIComponent(JSON.stringify(selectedCountries))}`;
          console.log("Navigating to:", url);
          router.push(url);
        }}
      >
        Finish My Trip!
      </Button>
      {microLocations ? (
        <MacroCard
          options={microLocations}
          onSelect={handleSelect}
          onRemove={handleRemove}
          size="small"
        />
      ) : (
        <div className="text-center text-gray-600">No locations found</div>
      )}
    </div>
  );
}
