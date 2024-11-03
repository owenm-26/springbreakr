"use client";
import { useSearchParams } from "next/navigation";
import MacroCard, { MacroLocationOption } from "@/components/MacroCard";
import { useEffect, useState } from "react";

export default function MicroLocationPage() {
  const searchParams = useSearchParams();
  const country = searchParams.get("country");
  const prompt = searchParams.get("prompt");

  const [microLocations, setMicroLocations] = useState<
    MacroLocationOption[] | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!country || !prompt) return; // Ensure both parameters are available
      try {
        const response = await fetch(
          `/api/get_micro_recommendations?country=${encodeURIComponent(
            country
          )}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt }), // Pass the prompt to the server
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.recommendation) {
          const locations = JSON.parse(data.recommendation).map(
            (item: MacroLocationOption) => ({
              country: item.country,
              description: item.description,
              status: 0,
            })
          );
          setMicroLocations(locations);
        }
      } catch (error) {
        console.error("Failed to fetch micro recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [country, prompt]); // Add prompt to dependencies

  // Other component code (handleSelect, handleRemove, loading state, etc.)

  const handleSelect = (country: MacroLocationOption) => {
    if (!microLocations) return;

    setMicroLocations(
      (prevLocations) =>
        prevLocations?.map((location) =>
          location.country === country.country
            ? { ...location, status: 2 }
            : location
        ) || null
    );
  };

  const handleRemove = (country: MacroLocationOption) => {
    if (!microLocations) return;

    setMicroLocations(
      (prevLocations) =>
        prevLocations?.map((location) =>
          location.country === country.country
            ? { ...location, status: 1 }
            : location
        ) || null
    );
  };

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
        <p>Loading locations...</p>
      </main>
    );
  }

  return (
    <main>
      {microLocations ? (
        <MacroCard
          options={microLocations}
          onSelect={handleSelect}
          onRemove={handleRemove}
          size="small"
        />
      ) : (
        <p>Error</p>
      )}
    </main>
  );
}
