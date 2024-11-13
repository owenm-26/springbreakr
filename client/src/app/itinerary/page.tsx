"use client";
import { Trip } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Col, Row } from "antd";

export default function ItineraryPage() {
  const [trip, setTrip] = useState<Trip>();

  const searchParams = useSearchParams();
  const id = searchParams.get("tripId");

  useEffect(() => {
    const getTripById = async () => {
      try {
        const response = await fetch(`api/get_trip_by_id?id=${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        setTrip(data.trip);
        console.log(data.trip);
      } catch (e) {
        console.error("Error getting locationById");
      }
    };
    getTripById();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex flex-col items-center p-8 ">
      <h1 className="text-4xl font-extrabold text-white mb-6 ">
        {trip?.macroLocation}
      </h1>
      <StepForwardOutlined />

      {trip ? (
        <div>
          <Row>
            <Col span={6}>col-6</Col>
            <Col span={6}>col-6</Col>
            <Col span={6}>col-6</Col>
            <Col span={6}>col-6</Col>
          </Row>
        </div>
      ) : (
        <p>Loading your perfect trip...</p>
      )}
    </div>
  );
}
