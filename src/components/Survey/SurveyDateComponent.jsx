import React, { useEffect, useState } from "react";
import { Box, Text, DatePicker } from "zmp-ui";
import ErrorComponent from "../error";
import moment from "moment";

const SurveyDateComponent = ({
  title,
  name,
  value,
  error = false,
  action = undefined,
  placeholder = "",
  required = false,
  isBetween = true,
}) => {
  const [data, setData] = useState(moment().format("YYYY-MM-DD"));

  useEffect(() => {
    action(data);
  }, [data]);

  return (
    <Box className={`flex flex-col ${isBetween && "justify-between"}`}>
      <Box>
        <Text size="large" className="text-[#333] font-bold w-auto">
          {title} {required && <span className="text-red-500"> * </span>}
        </Text>
      </Box>
      <Box>
        <DatePicker
          mask
          maskClosable
          dateFormat="dd/mm/yyyy"
          title={placeholder}
          placeholder={placeholder}
          onChange={(value) => {
            setData(moment(value).format("YYYY-MM-DD"));
          }}
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

export default SurveyDateComponent;
