"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New loading state
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (summary.trim()) {
      setIsLoading(true); // Set loading to true when request starts

      // Call the Next.js API route to get recommendations
      const response = await fetch("/api/get_macro_recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: summary }),
      });

      const data = await response.json();
      setIsLoading(false); // Set loading to false when response received

      if (response.ok) {
        // Handle the successful response
        router.push(
          `/summary?request=${encodeURIComponent(
            summary
          )}&recommendations=${encodeURIComponent(data.recommendation)}`
        );
      } else {
        // Handle error response
        console.error("Error fetching recommendations:", data.error);
      }
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-4xl font-bold mb-4 text-black">
        Spring Break Finder
      </h1>
      <p className="mb-8 text-gray-800">
        Tell us what you want to do for spring break!
      </p>

      {isLoading ? (
        // Loading screen or spinner while waiting for response
        <div className="flex flex-col items-center">
          <p className="text-xl text-blue-500">
            Loading your recommendations...
          </p>
          <div className="loader mt-4 w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        // Form only displays when not loading
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Enter your summary here..."
            className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-gray-800"
            rows={4}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
          >
            Find My Spring Break Destination
          </button>
        </form>
      )}
    </main>
  );
}
