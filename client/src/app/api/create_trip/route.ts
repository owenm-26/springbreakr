import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { MicroLocationOption } from "@/app/microlocations/page";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { macroLocation, microLocations, joinCode } = await request.json();

    const newTrip = await prisma.trip.create({
      data: {
        macroLocation: macroLocation,
        microLocations: {
          create: microLocations.map((location: MicroLocationOption) => ({
            name: location.location,
            imageUrl: location.imageUrl,
          })),
        },
        joinCode: 0,
      },
      include: { microLocations: true },
    });

    return NextResponse.json({
      message: "Trip created successfully",
      trip: newTrip,
    });
  } catch (e) {
    console.error("Error creating trip:", e);
    return NextResponse.json(
      { message: "Failed to create trip", error: e },
      { status: 500 }
    );
  }
}
