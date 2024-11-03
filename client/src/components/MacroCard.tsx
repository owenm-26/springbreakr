import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Typography } from "antd";

const { Title, Text } = Typography;

interface MacroLocationOption {
  country: string;
  description: string;
  imageUrl?: string;
  status: number;
}

interface MacroCardProps {
  options: MacroLocationOption[];
  onSelect: (country: MacroLocationOption) => void;
  onRemove: (country: MacroLocationOption) => void;
}

const MacroCard: React.FC<MacroCardProps> = ({
  options,
  onSelect,
  onRemove,
}) => {
  const [leftOption, setLeftOption] = useState<MacroLocationOption | null>(
    null
  );
  const [rightOption, setRightOption] = useState<MacroLocationOption | null>(
    null
  );
  const [removingLeft, setRemovingLeft] = useState(false);
  const [removingRight, setRemovingRight] = useState(false);

  useEffect(() => {
    const eligible = options.filter((option) => option.status !== 1);
    setLeftOption(eligible[0] || null);
    setRightOption(eligible[1] || null);
  }, [options]);

  const handleSelect = (country: MacroLocationOption) => {
    onSelect(country);
  };

  const handleRemove = async (
    country: MacroLocationOption,
    side: "left" | "right"
  ) => {
    if (side === "left") {
      setRemovingLeft(true);
    } else {
      setRemovingRight(true);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    onRemove(country);

    if (side === "left") {
      const nextEligible = options.filter(
        (option) =>
          option.status !== 1 && option.country !== leftOption?.country
      );
      setLeftOption(nextEligible[0] || null);
      setRemovingLeft(false);
    } else {
      const nextEligible = options.filter(
        (option) =>
          option.status !== 1 && option.country !== rightOption?.country
      );
      setRightOption(nextEligible[0] || null);
      setRemovingRight(false);
    }
  };

  return (
    <Row className="h-[90vh] w-full justify-center items-center">
      <Col className="flex justify-center w-1/2">
        {leftOption && (
          <div
            className={`relative w-[90%] transition-all duration-1000
              ${removingLeft ? "animate-shake bg-red-100" : ""}`}
          >
            <Card className="relative overflow-hidden rounded-lg shadow-lg">
              {/* Cross-out line when removing */}
              <div
                className={`absolute inset-0 z-10 bg-red-500/20 flex items-center justify-center
                transition-transform duration-1000 pointer-events-none
                ${removingLeft ? "translate-x-0" : "-translate-x-full"}`}
              >
                {removingLeft && (
                  <svg
                    className="w-32 h-32 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </div>

              <div className="h-[60vh] overflow-hidden rounded-t-lg">
                <img
                  alt={leftOption.country}
                  src={leftOption.imageUrl || "/api/placeholder/800/600"}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4">
                <Title level={3}>{leftOption.country}</Title>
                <Text>{leftOption.description}</Text>

                <div className="absolute bottom-4 right-4 flex gap-2">
                  <Button
                    onClick={() => handleSelect(leftOption)}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    Select
                  </Button>
                  <Button
                    onClick={() => handleRemove(leftOption, "left")}
                    variant="solid"
                    className="hover:bg-red-100"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Col>

      <Col className="flex justify-center w-1/2">
        {rightOption && (
          <div
            className={`relative w-[90%] transition-all duration-1000
              ${removingRight ? "animate-shake bg-red-100" : ""}`}
          >
            <Card className="relative overflow-hidden rounded-lg shadow-lg">
              {/* Cross-out line when removing */}
              <div
                className={`absolute inset-0 z-10 bg-red-500/20 flex items-center justify-center
                transition-transform duration-1000 pointer-events-none
                ${removingRight ? "translate-x-0" : "-translate-x-full"}`}
              >
                {removingRight && (
                  <svg
                    className="w-32 h-32 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </div>

              <div className="h-[60vh] overflow-hidden rounded-t-lg">
                <img
                  alt={rightOption.country}
                  src={rightOption.imageUrl || "/api/placeholder/800/600"}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4">
                <Title level={3}>{rightOption.country}</Title>
                <Text>{rightOption.description}</Text>

                <div className="absolute bottom-4 right-4 flex gap-2">
                  <Button
                    onClick={() => handleSelect(rightOption)}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    Select
                  </Button>
                  <Button
                    onClick={() => handleRemove(rightOption, "right")}
                    variant="solid"
                    className="hover:bg-red-100"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Col>
    </Row>
  );
};

export default MacroCard;
