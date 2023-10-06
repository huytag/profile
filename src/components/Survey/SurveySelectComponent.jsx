import { placeholder } from "@babel/types";
import React from "react";
import { Box, Text, Select } from "zmp-ui";
import ErrorComponent from "../error";
const { Option } = Select;

const SurveySelectComponent = ({
  title,
  name,
  options = [],
  placeholder = "",
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
        <Select
          placeholder={placeholder}
          name={name}
          className="zaui-input-affix-wrapper font-medium"
          closeOnSelect
          onChange={(e) => action(e)}
          isClearable
        >
          {options?.map((value, index) => {
            return (
              <Option value={value?.value} title={value?.label} key={index} />
            );
          })}
        </Select>
      </Box>

      {required && (
        <Box>
          <ErrorComponent title="Vui lòng nhập trường này" isShow={error} />
        </Box>
      )}
    </Box>
  );
};

export default SurveySelectComponent;
