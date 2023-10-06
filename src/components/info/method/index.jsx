import React from "react";
import { Text } from "zmp-ui";

const InfoMethodComponent = ({
  title = "Phương án",
  value,
  isFlexCol = false,
}) => {
  return (
    <div
      className={`mt-5 flex justify-between ${
        isFlexCol ? "flex-col" : "items-center"
      }`}
    >
      <Text.Title size="small">{title}</Text.Title>
      <Text
        size="xSmall"
        className={`text-gray-500 ${isFlexCol ? "mt-3" : "ml-3"}`}
      >
        {value}
      </Text>
    </div>
  );
};

export default InfoMethodComponent;
