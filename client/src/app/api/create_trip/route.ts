import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { macroLocation, microLocations, joinCode } = await request.json(); // Extract prompt from request body
    console.log(macroLocation, microLocations, joinCode);

    const newTrip = await prisma.trip.create({
      data: {
        macroLocation: macroLocation,
        microLocations: {
          create: microLocations.map((location: string) => ({
            name: location,
            dislikers: [],
            likers: [],
          })),
        },
      },
      include: { microLocations: true },
    });

    // edit trip to add join code
    if (joinCode) {
      console.log("add join code");
    }
    return NextResponse.json({
      message: "Trip created successfully",
      trip: newTrip,
    });
  } catch (e) {
    return NextResponse.json(
      { message: "Failed to create trip", error: e },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
