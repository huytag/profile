import React from "react";
import { Box, Text, Radio } from "zmp-ui";
import ErrorComponent from "../error";

const SurveyRadioComponent = ({
  title,
  name,
  options = [],
  checked = undefined,
  error = false,
  action = undefined,
  required = false,
  isColumn = true,
}) => {
  return (
    <Box className="flex flex-col">
      <Box>
        <Text size="large" className="text-[#333] font-bold w-auto">
          {title} {required && <span className="text-red-500"> * </span>}
        </Text>
      </Box>
      <Box className={`flex ${isColumn && "flex-col"}`}>
        {options?.map((option, index) => {
          return (
            <Radio
              size="large"
              className="my-2"
              value={option?.value}
              checked={checked == option?.value}
              required={required}
              name={name}
              label={option?.label}
              key={index}
              onChange={(e) => action(e)}
            />
          );
        })}
      </Box>
      {required && (
        <Box>
          <ErrorComponent title="Vui lòng nhập trường này" isShow={error} />
        </Box>
      )}
    </Box>
  );
};

export default SurveyRadioComponent;
