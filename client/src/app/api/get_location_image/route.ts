import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location");
  const scenario = searchParams.get("scenario");

  if (!location || !scenario) {
    return NextResponse.json(
      { error: "Please provide a location" },
      { status: 400 }
    );
  }

  // Fetch the image URL for the specified location
  const url = `${
    process.env.NEXT_PUBLIC_BACKEND_URL
  }/location-image?location=${encodeURIComponent(
    location
  )}&scenario=${encodeURIComponent(scenario)}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    const data = await response.json();
    return NextResponse.json({
      location: data.location,
      image_url: data.image_url,
    });
  } else {
    return NextResponse.json(
      { error: "No image found for the specified location" },
      { status: 404 }
    );
  }
}
