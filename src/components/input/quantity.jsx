import React from "react";
import { Box, Input } from "zmp-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import ErrorComponent from "../error";

const InputQuantity = ({
  value,
  action,
  maxValue = 9999999999999999999999,
  required = false,
  isError = false,
  textError = "Chọn số lượng",
}) => {
  const onAction = (type, value = 0) => {
    if (type === "increase") {
      value++;
    } else if (type === "decrease" && value > 0) {
      value--;
    } else if (type === "change") {
      if (value > maxValue) {
        action(maxValue);
        return;
      }

      value > 0 ? value : 0;
    }

    action(value);
  };

  return (
    <>
      <Box className="flex">
        <button
          className={`text-white bg-[#f87171] p-0 w-[30px] rounded-l-md ${
            value === 0 && "bg-[#fed8d7]"
          }`}
          onClick={() => onAction("decrease", value)}
          disabled={value === 0}
        >
          <FontAwesomeIcon icon={faMinus} />
        </button>
        <Input
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          size="small"
          placeholder="0"
          className="w-[40px] m-0 h-full py-1 px-0 bg-ta-500 border-2 border-l-0 border-r-0 rounded-none text-center"
          value={value}
          onChange={(e) => onAction("change", e.target.value)}
        />
        <button
          disabled={value === maxValue}
          className={`text-white bg-[#3b82f6] p-0 w-[30px] rounded-r-md ${
            value >= maxValue && "bg-[#93c5fd]"
          }`}
          onClick={() => onAction("increase", value)}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </Box>

      {required && isError ? <ErrorComponent title={textError} isShow /> : ""}
    </>
  );
};

export default InputQuantity;
