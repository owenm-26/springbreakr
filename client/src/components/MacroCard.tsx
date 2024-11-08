import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Typography } from "antd";

const { Title, Text } = Typography;

export interface MacroLocationOption {
  country: string;
  description: string;
  status: number;
  imageUrl?: string;
}

interface MacroCardProps {
  options: MacroLocationOption[];
  onSelect: (country: MacroLocationOption) => void;
  onRemove: (country: MacroLocationOption) => void;
  size?: "mini" | "small" | "large";
}

const MacroCard: React.FC<MacroCardProps> = ({
  options,
  onSelect,
  onRemove,
  size = "large",
}) => {
  const [displayOptions, setDisplayOptions] = useState<MacroLocationOption[]>(
    []
  );

  useEffect(() => {
    const eligible = options.filter((option) => option.status !== 1);
    if (size === "large") {
      setDisplayOptions(eligible.slice(0, 2));
    } else if (size === "mini") {
      setDisplayOptions(eligible.slice(0, 12));
    } else {
      setDisplayOptions(eligible.slice(0, 6));
    }
  }, [options, size]);

  const renderCard = (option: MacroLocationOption) => (
    <div
      className={`relative ${
        size === "large"
          ? "w-[90%] h-[70vh]"
          : size === "small"
          ? "w-full h-[50vh]"
          : "w-full h-[30vh]" // mini size height adjustment
      }`}
    >
      <Card className="relative overflow-hidden rounded-lg shadow-lg h-full">
        <div
          className={`h-${
            size === "large"
              ? "[200px]"
              : size === "small"
              ? "[150px]"
              : "[10px]" // mini size image height
          } overflow-hidden rounded-t-lg`}
        >
          <img
            alt={option?.country || ""}
            src={
              option?.imageUrl ||
              "https://i0.wp.com/picjumbo.com/wp-content/uploads/beautiful-nature-mountain-scenery-with-flowers-free-photo.jpg?w=2210&quality=70"
            }
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <Title level={size === "small" ? 4 : size === "mini" ? 5 : 3}>
            {option?.country}
          </Title>
          <Text className={`line-clamp-${size === "mini" ? 1 : 2}`}>
            {option?.description}
          </Text>
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button
              onClick={() => onSelect(option)}
              className="bg-green-500 hover:bg-green-600"
              size={
                size === "small"
                  ? "small"
                  : size === "mini"
                  ? "small"
                  : "middle"
              }
            >
              Select
            </Button>
            <Button
              onClick={() => onRemove(option)}
              className="hover:bg-red-100"
              size={
                size === "small"
                  ? "small"
                  : size === "mini"
                  ? "small"
                  : "middle"
              }
            >
              Remove
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <Row className="h-[90vh] w-full">
      {size === "large" ? (
        <>
          <Col className="flex justify-center w-1/2">
            {renderCard(displayOptions[0])}
          </Col>
          <Col className="flex justify-center w-1/2">
            {renderCard(displayOptions[1])}
          </Col>
        </>
      ) : (
        <div className="h-[90vh] w-full p-4">
          <Row gutter={[16, 16]}>
            {displayOptions.map((option, index) => (
              <Col key={index} span={size === "mini" ? 6 : 8}>
                {renderCard(option)}
              </Col>
            ))}
          </Row>
        </div>
      )}
    </Row>
  );
};

export default MacroCard;
