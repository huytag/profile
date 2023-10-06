import React, { useState } from "react";
import { Box, Button, Checkbox, Input, Text } from "zmp-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleRight } from "@fortawesome/free-regular-svg-icons";
import ErrorComponent from "../error";
import { empty } from "../../utils";

const CheckBoxListComponent = ({
  options,
  action,
  isAdd = true,
  isShowError = true,
  errorTitle = "",
  placeholder = "",
}) => {
  const [optionNew, setOptionNew] = useState("");

  const onAction = (type, value) => {
    action(type, value);
    type === "add" && setOptionNew("");
  };

  return (
    <div className="flex align-item-center flex-col justify-between mt-2">
      {options.map((option, index) => {
        return (
          <Box key={index} className="py-2">
            <Checkbox
              label={option.label}
              name="option-fee"
              value={option.id}
              id={option.id}
              key={option.id}
              className="flex flex-row-reverse"
              checked={option.checked}
              onChange={() => onAction("checked", index)}
            />
            <hr className="mt-2 bg-[#ddd] h-[2px]" />
          </Box>
        );
      })}

      <ErrorComponent title={errorTitle} isShow={isShowError} />

      {isAdd && (
        <Box mt={2}>
          <Text.Title size="small">Khác</Text.Title>
          <div className="flex align-items-center">
            <Box className="w-100">
              <Input
                name="option-other"
                placeholder={placeholder}
                size="small"
                value={optionNew}
                onChange={(e) => setOptionNew(e.target.value)}
              />
            </Box>
            <Box ml={2}>
              <Button
                disabled={empty(optionNew)}
                size="small"
                onClick={() => onAction("add", optionNew)}
              >
                Thêm
                <FontAwesomeIcon
                  icon={faArrowAltCircleRight}
                  size="lg"
                  className="ml-1"
                />
              </Button>
            </Box>
          </div>
        </Box>
      )}
    </div>
  );
};

export default CheckBoxListComponent;
