import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country");
  const { prompt } = await req.json(); // Extract prompt from request body

  if (!country) {
    return NextResponse.json(
      { error: "Country parameter is missing" },
      { status: 400 }
    );
  }

  if (!prompt) {
    return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/get_recommendations/micro/${country}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }), // Ensure body is in JSON format
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Request failed with status code: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ error: data.error }, { status: 500 });
    }

    return NextResponse.json(
      { recommendation: data.recommendation },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error contacting Flask API:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching micro recommendations" },
      { status: 500 }
    );
  }
}
