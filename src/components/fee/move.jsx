import React from "react";
import { Box, Checkbox, Input, Text } from "zmp-ui";
import ErrorComponent from "../error";

const MoveFeeComponent = ({
  options = [],
  changeMoveFee,
  isShowError = true,
  errorTitle = "",
}) => {
  const onChangeMoveFee = (e, type, index) => {
    const newMoveFee = [...options];
    if (type === "checked") {
      newMoveFee[index].checked = e.target.checked;
    }

    if (type === "change") {
      const value = parseInt(e.target.value);
      newMoveFee[index][e.target.name] = value ?? 0;
    }

    changeMoveFee(newMoveFee);
  };

  return (
    <Box mt={8}>
      <Box className="flex align-item-center justify-between">
        <Text.Title size="small">Chi phí di chuyển</Text.Title>
        <Text.Title size="small">Giá tiền (VNĐ)</Text.Title>
      </Box>
      <hr className="mt-3 bg-[#ddd] h-[2px]" />

      <Box my={2}>
        <Box className="flex align-item-center justify-between">
          <Text.Title size="small">Hạng mục di chuyển</Text.Title>
        </Box>
        {options.map((moveItem, index) => {
          return (
            <Box key={index} className="py-2">
              <Checkbox
                label={moveItem.label}
                name="move_item_fee"
                value={moveItem.value}
                id={moveItem.value}
                className="flex flex-row"
                onChange={(e) => onChangeMoveFee(e, "checked", index)}
              />
              {moveItem.type == 2 && moveItem?.checked && (
                <Input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  name="quantity"
                  placeholder="Nhập số km"
                  size="small"
                  value={moveItem?.quantity}
                  min="0"
                  onChange={(e) => onChangeMoveFee(e, "change", index)}
                />
              )}
            </Box>
          );
        })}
      </Box>
      <ErrorComponent title={errorTitle} isShow={isShowError} />
    </Box>
  );
};

export default MoveFeeComponent;
