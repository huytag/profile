import React from "react";
import { Text } from "zmp-ui";

const TextBaseLineComponent = ({
  title,
  value,
  mt = 3,
  isBetween = true,
  boldTitle = false,
  className = "",
}) => {
  return (
    <div
      className={`flex items-center ${isBetween && "justify-between"} mt-${mt}`}
    >
      <div className={className}>
        <Text
          size="small"
          className={`text-gray-600 w-auto ${
            boldTitle && "font-bold text-black"
          }`}
        >
          {title}
        </Text>
      </div>
      <div>
        <Text
          size="small"
          className={`ml-3 font-semibold ${isBetween && "text-right"}`}
        >
          {value ?? "-"}
        </Text>
      </div>
    </div>
  );
};

export default TextBaseLineComponent;
