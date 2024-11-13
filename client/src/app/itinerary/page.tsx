"use client";
import { Trip } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ItineraryPage() {
  const [locations, setLocations] = useState<string[]>([]);
  const [trip, setTrip] = useState<Trip>();

  const searchParams = useSearchParams();
  const id = searchParams.get("tripId");

  useEffect(() => {
    const getTripById = async () => {
      try {
        const response = await fetch(`api/get_trip_by_id?id=${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        setTrip(data.trip);
        console.log(data.trip);
      } catch (e) {
        console.error("Error getting locationById");
      }
    };
    getTripById();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex flex-col items-center p-8 ">
      <h1 className="text-4xl font-extrabold text-white mb-6 animate-bounce">
        Your Itinerary
      </h1>

      {trip ? (
        <div className="mt-8 bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Details</h2>
          <p className="text-gray-700">
            Country:{" "}
            <span className="font-bold text-blue-600">
              {trip?.macroLocation}
            </span>
          </p>{" "}
        </div>
      ) : (
        <p>Loading your perfect trip...</p>
      )}
    </div>
  );
}
