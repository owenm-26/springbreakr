import { NextResponse } from "next/server";

// Load environment variables
const SEARCH_ENGINE_ID = process.env.NEXT_PUBLIC_SEARCH_ENGINE_ID;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

async function fetchImageForLocation(location: string): Promise<string | null> {
  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
    location
  )}&cx=${SEARCH_ENGINE_ID}&searchType=image&key=${API_KEY}`;

  console.log(url);
  const response = await fetch(url);

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  if (data.items && data.items.length > 0) {
    // Return the first image result
    return data.items[0].link;
  }

  return null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location");

  if (!location) {
    return NextResponse.json(
      { error: "Please provide a location" },
      { status: 400 }
    );
  }

  // Fetch the image URL for the specified location
  const imageUrl = await fetchImageForLocation(location);

  if (imageUrl) {
    return NextResponse.json({ location, image_url: imageUrl });
  } else {
    return NextResponse.json(
      { error: "No image found for the specified location" },
      { status: 404 }
    );
  }
}
