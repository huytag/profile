import React, { useEffect, useState } from "react";
import { Box, Text, Radio } from "zmp-ui";
import ErrorComponent from "../error";

const SurveyMultiChoiceComponent = ({
  title,
  name,
  options = [],
  checked = [],
  error = false,
  action = undefined,
  required = false,
  isColumn = true,
}) => {
  const [listChecked, setListChecked] = useState(checked);

  const handleChoice = (e, parentKey) => {
    const { value } = e.target;
    action(value, parentKey);
  };

  useEffect(() => {
    setListChecked(checked);
  }, [checked]);

  return (
    <Box className="flex flex-col">
      <Box>
        <Text size="large" className="text-[#333] font-bold w-auto">
          {title} <span className="text-red-500">{required && " * "}</span>
        </Text>
      </Box>

      <Box className={`flex ${isColumn && "flex-col"}`}>
        {options?.map((choices, key) => {
          return (
            <Box className="flex items-end justify-between " key={key}>
              <Text.Title>
                {choices?.label}
                <span className="text-red-500">{required && " * "}</span>
              </Text.Title>
              {choices?.questions.map((question, index) => {
                return (
                  <Radio
                    key={index}
                    size="large"
                    className="choices my-1 flex text-center flex-col-reverse items-center justify-between min-w-[100px]"
                    value={question?.value}
                    checked={listChecked.some(
                      (item) => Object.values(item) == question?.value
                    )}
                    required={required}
                    name={name}
                    label={question?.label}
                    onClick={(e) => handleChoice(e, choices?.value)}
                  />
                );
              })}
            </Box>
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

export default SurveyMultiChoiceComponent;
