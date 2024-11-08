import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { macroLocation, microLocations, joinCode } = await request.json();
    console.log(macroLocation, microLocations, joinCode);

    const newTrip = await prisma.trip.create({
      data: {
        macroLocation: macroLocation,
        microLocations: {
          create: microLocations.map((location: string) => ({
            name: location,
          })),
        },
        joinCode: joinCode || null, // Add joinCode if provided
      },
      include: { microLocations: true },
    });

    return NextResponse.json({
      message: "Trip created successfully",
      trip: newTrip,
    });
  } catch (e) {
    console.error("Error creating trip:", e); // Log full error details
    return NextResponse.json(
      { message: "Failed to create trip", error: e },
      { status: 500 }
    );
  }
}
