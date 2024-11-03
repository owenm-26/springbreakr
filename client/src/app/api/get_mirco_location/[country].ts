// pages/api/get_micro_recommendations/[country].ts

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { country } = req.query; // Get the country from the URL
  const { prompt } = req.body; // Extract the prompt from the request body

  if (!prompt) {
    return res.status(400).json({ error: "No prompt provided" });
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/get_recommendations/micro/${country}`, // URL of your Flask API
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      }
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Request failed with status code: ${response.status}` });
    }

    const data = await response.json();

    // If the Flask server returned an error
    if (data.error) {
      return res.status(500).json({ error: data.error });
    }

    // Send the recommendations back to the front-end
    res.status(200).json({ recommendation: data.recommendation });
  } catch (error) {
    console.error("Error contacting Flask API:", error);
    res.status(500).json({
      error: "An error occurred while fetching micro recommendations",
    });
  }
}
