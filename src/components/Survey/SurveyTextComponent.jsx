import React from "react";
import { Box, Text, Input } from "zmp-ui";
import ErrorComponent from "../error";

const SurveyTextComponent = ({
  title,
  name,
  value,
  error = false,
  action = undefined,
  placeholder = "",
  required = false,
  isBetween = true,
}) => {
  return (
    <Box className={`flex flex-col ${isBetween && "justify-between"}`}>
      <Box>
        <Text size="large" className="text-[#333] font-bold w-auto">
          {title} <span className="text-red-500">{required && " * "}</span>
        </Text>
      </Box>
      <Box>
        <Input
          value={value}
          name={name}
          placeholder={placeholder}
          onChange={(e) => action(e)}
          required={required}
        />
      </Box>
      {required && (
        <Box>
          <ErrorComponent title="Vui lòng nhập trường này" isShow={error} />
        </Box>
      )}
    </Box>
  );
};

export default SurveyTextComponent;
