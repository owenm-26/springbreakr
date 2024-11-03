"use client";

import MacroCard, { MacroLocationOption } from "@/components/MacroCard";
import { useEffect, useState } from "react";

export default function MicroLocationPage({
  country,
  prompt,
}: {
  country: string;
  prompt: string;
}) {
  const [microLocations, setMicroLocations] = useState<
    MacroLocationOption[] | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/get_micro_recommendations/${country}`,
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
        console.log(data.recommendation);

        // Assuming `recommendation` is an array of locations with 'location' and 'description'
        if (data.recommendation) {
          const locations = JSON.parse(data.recommendation).map(
            (item: MacroLocationOption) => ({
              country: item.location,
              description: item.description,
              status: 0,
              imageUrl: "", // Placeholder for imageUrl
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
  }, [country, prompt]);

  if (loading) {
    return <p>Loading recommendations...</p>;
  }

  return (
    <main className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-4xl">
      {microLocations?.map((location) => (
        <MacroCard
          key={location.country}
          option={location}
          onSelect={() => console.log(`Selected ${location.country}`)}
          onRemove={() => console.log(`Removed ${location.country}`)}
          size="small"
        />
      ))}
    </main>
  );
}
