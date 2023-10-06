import React, { useState } from "react";
import { Box, Checkbox, Input, Text } from "zmp-ui";
import ErrorComponent from "../error";

const SurveyCheckBoxComponent = ({
  title,
  options,
  name,
  action,
  isAdd = true,
  error = false,
  required = false,
  placeholder = "",
}) => {
  const [data, setData] = useState([null]);

  const onAction = (e, type) => {
    const { value, checked } = e.target;
    let newData = [...data];
    if (type) {
      newData[0] = value;
    } else {
      if (checked) {
        newData.push(value);
      } else {
        newData = newData.filter((item) => item != value);
      }
    }
    setData(newData);
    action(newData);
  };

  return (
    <Box className="flex align-item-center flex-col justify-between mt-2">
      <Box>
        <Text size="large" className="text-[#333] font-bold w-auto">
          {title} {required && <span className="text-red-500"> * </span>}
        </Text>
      </Box>
      {options?.map((option, index) => {
        return (
          <Box key={index} className="py-2">
            <Checkbox
              label={option.label}
              name={name}
              value={option?.value}
              id={option?.value}
              key={option?.value}
              className="flex"
              onChange={(e) => onAction(e)}
            />
          </Box>
        );
      })}
      <ErrorComponent title="Vui lòng nhập trường này" isShow={error} />

      {isAdd && (
        <Box mt={2} className="flex justify-between items-center">
          <Text.Title size="small">Khác</Text.Title>
          <Box className="flex items-center">
            <Input
              name={name}
              placeholder={placeholder}
              size="small"
              onChange={(e) => onAction(e, "other")}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SurveyCheckBoxComponent;
