import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Typography } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

import { MacroLocationOption } from "@/app/summary/page";

const { Title, Text } = Typography;

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
  const [currentOptions, setCurrentOptions] = useState<MacroLocationOption[]>(
    []
  );
  const [eligibleOptions, setEligibleOptions] = useState<MacroLocationOption[]>(
    []
  );

  // Initialize state with options
  useEffect(() => {
    setEligibleOptions(options.filter((option) => option.status === 0));
    setCurrentOptions(
      options.filter((option) => option.status === 0).slice(0, 2)
    ); // Only show two options initially
  }, [options]);

  // Handle selection of an option
  const handleSelect = (country: MacroLocationOption) => {
    onSelect(country);
  };

  // Handle removal of an option
  const handleRemove = (country: MacroLocationOption) => {
    setCurrentOptions((prev) => prev.filter((option) => option !== country));
    onRemove(country);

    // Update eligible options after removal
    const nextEligible = eligibleOptions.filter((option) => option !== country);
    if (nextEligible.length > 0) {
      const nextOption = nextEligible[0]; // Get the next eligible option
      setCurrentOptions((prev) => {
        if (prev.length < 2) {
          return [...prev, nextOption]; // Add the next eligible option if there's space
        }
        return prev;
      });
    }
  };

  return (
    <Row
      justify="center"
      align="middle"
      style={{ height: "90vh", width: "100%" }}
    >
      {currentOptions.map((country, index) => (
        <Col
          key={index}
          span={12}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Card
            hoverable
            style={{
              width: "90%",
              height: "100%",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              position: "relative",
            }}
            cover={
              <img
                alt={country.country}
                src={
                  "https://i0.wp.com/picjumbo.com/wp-content/uploads/beautiful-nature-mountain-scenery-with-flowers-free-photo.jpg?w=2210&quality=70"
                }
                style={{
                  borderRadius: "10px 10px 0 0",
                  height: "60%",
                  objectFit: "cover",
                }}
              />
            }
          >
            <Title level={3}>{country.country}</Title>
            <Text>{country.description}</Text>
            <div
              style={{ position: "absolute", bottom: "16px", right: "16px" }}
            >
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => handleSelect(country)}
              />
              <Button
                type="default"
                icon={<CloseCircleOutlined />}
                onClick={() => handleRemove(country)}
                style={{ marginLeft: "8px" }}
              />
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default MacroCard;
