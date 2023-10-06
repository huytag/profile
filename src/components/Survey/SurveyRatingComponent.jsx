import React, { useEffect, useState } from "react";
import { Box, Text } from "zmp-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ErrorComponent from "../error";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStartRegular } from "@fortawesome/free-regular-svg-icons";

const SurveyRatingComponent = ({
  title,
  options,
  action,
  error = false,
  required = false,
}) => {
  const [rate, setRate] = useState(options);

  useEffect(() => {
    action(rate);
  }, [rate]);

  return (
    <Box className="flex align-item-center flex-col justify-between mt-3">
      <Box>
        <Text size="large" className="text-[#333] font-bold w-auto">
          {title} {required && <span className="text-red-500"> * </span>}
        </Text>
      </Box>
      <Box className="flex justify-between items-center text-center text-yellow-500 text-3xl mt-1">
        {[...Array(rate)]?.map((value, index) => (
          <FontAwesomeIcon
            icon={faStar}
            key={index}
            onClick={() => setRate(index + 1)}
          />
        ))}
        {[...Array(5 - rate)]?.map((value, index) => (
          <FontAwesomeIcon
            icon={faStartRegular}
            key={index}
            onClick={() => setRate(rate + index + 1)}
          />
        ))}
      </Box>
      <ErrorComponent title="Vui lòng chọn" isShow={error} />
    </Box>
  );
};

export default SurveyRatingComponent;
