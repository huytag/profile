import React, { useState } from "react";
import { Box, Text, Input, Picker } from "zmp-ui";
import ErrorComponent from "../error";

const SurveyTimeComponent = ({
  title,
  name,
  value,
  error = false,
  action = undefined,
  placeholder = "",
  required = false,
  isBetween = true,
}) => {
  const generateTime = (name, number, prefix = "Option") => {
    const data = [];
    for (let i = 0; i < number; i++) {
      data.push({
        value: i,
        displayName: `${i} ${prefix} `,
      });
    }
    return data;
  };

  const [data, setData] = useState({
    hour: 0,
    minute: 0,
    second: 0,
  });

  const handleChange = (e) => {
    if (!e) return;
    const newTime = {
      hour: e?.hour?.value,
      minute: e?.minute?.value,
      second: e?.second?.value,
    };
    setData(newTime);
  };

  return (
    <Box className={`flex flex-col ${isBetween && "justify-between"}`}>
      <Box>
        <Text size="large" className="text-[#333] font-bold w-auto">
          {title} {required && <span className="text-red-500"> * </span>}
        </Text>
      </Box>
      <Box>
        <Picker
          placeholder={placeholder}
          mask
          maskClosable
          title={title}
          onChange={(e) => {
            handleChange(e);
          }}
          action={{
            text: "Chọn",
            close: true,
            onClick: () => {
              console.log(data);
              action(data);
            },
          }}
          data={[
            {
              options: generateTime("hour", 24, " giờ"),
              name: "hour",
            },
            {
              options: generateTime("minute", 60, " phút"),
              name: "minute",
            },
            {
              options: generateTime("second", 60, " giây"),
              name: "second",
            },
          ]}
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

export default SurveyTimeComponent;
