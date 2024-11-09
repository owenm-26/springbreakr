import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography } from "antd";

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
          : "w-full h-[30vh]"
      }`}
    >
      <Card className="relative overflow-hidden rounded-lg shadow-lg h-full">
        <div
          className={`h-${
            size === "large"
              ? "[200px]"
              : size === "small"
              ? "[150px]"
              : "[100px]"
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
            <button
              onClick={() => onSelect(option)}
              className="bg-green-500 hover:bg-green-600 inline-flex items-center justify-center px-4 py-2"
              style={{
                fontSize:
                  size === "small" || size === "mini" ? "small" : "medium",
              }}
            >
              Select
            </button>
            <button
              onClick={() => onRemove(option)}
              className="hover:bg-red-100 inline-flex items-center justify-center px-4 py-2"
              style={{
                fontSize:
                  size === "small" || size === "mini" ? "small" : "medium",
              }}
            >
              Remove
            </button>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <Row className="h-[90vh] w-full" gutter={[16, 16]} justify="center">
      {displayOptions.map((option, index) => (
        <Col
          key={index}
          xs={24}
          sm={12}
          md={8}
          lg={size === "large" ? 12 : 8}
          className="flex justify-center"
        >
          {renderCard(option)}
        </Col>
      ))}
    </Row>
  );
};

export default MacroCard;
