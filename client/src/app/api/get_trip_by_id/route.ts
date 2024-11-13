import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json(
        {
          message: `No id given`,
        },
        { status: 500 }
      );
    }
    const trip = await prisma.trip.findFirst({
      where: { id: id },
      select: {
        joinCode: true,
        microLocations: true,
        macroLocation: true,
        anonymousVoting: true,
        travelers: true,
      },
    });

    return NextResponse.json({
      message: "Trip fetched successfully",
      trip: trip,
    });
  } catch (e) {
    console.error("Error fetching trip");
    return NextResponse.json(
      {
        message: `Failed to get trip`,
        error: e,
      },
      { status: 500 }
    );
  }
}
