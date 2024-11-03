// app/itinerary/page.tsx

// import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ItineraryPage = () => {
  //   const router = useRouter();
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    // Get the URL query parameters
    const query = new URLSearchParams(window.location.search);
    const itineraryParam = query.get("itinerary");

    // Parse the itinerary parameter if it exists
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
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Your Itinerary</h1>
      {locations.length > 0 ? (
        <ul className="list-disc pl-5">
          {locations.map((location, index) => (
            <li key={index} className="mb-2 text-lg">
              {location}
            </li>
          ))}
        </ul>
      ) : (
        <p>No locations found in your itinerary.</p>
      )}
    </div>
  );
};

export default ItineraryPage;
