import React, { useState } from "react";
import { Box, Button, Input, Text } from "zmp-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ErrorComponent from "../error";
import InputQuantity from "../input/quantity";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";

const ListFeeComponent = ({
  items,
  action,
  isAdd = true,
  isShowError = true,
  errorTitle = "",
  placeholder = "",
}) => {
  const initOption = {
    name: null,
    quantity: null,
    price: null,
    price_labor: null,
  };
  const [optionNew, setOptionNew] = useState([initOption]);

  const onAction = (type, index = 0, value = 0) => {
    action(type, index, value);

    if (type === "delete") {
      const newOption = _.cloneDeep(optionNew);
      newOption.pop();
      action("changeOther", newOption);
      setOptionNew(newOption);
    }

    type === "add" && setOptionNew([...optionNew, initOption]);
  };

  const onHandleChange = (index, name, value) => {
    const newOption = _.cloneDeep(optionNew);
    newOption[index][name] = value;
    setOptionNew(newOption);
    action("changeOther", newOption);
  };

  return (
    <div className="flex flex-col mt-2">
      {items.map((item, index) => {
        return (
          <Box key={index}>
            <Box className="py-2 flex items-center justify-between">
              <Text.Title size="small">{item.label}</Text.Title>
              <InputQuantity
                value={item?.quantity ? item.quantity : 0}
                action={(value) => onAction("change", index, value)}
              />
            </Box>
            <hr className="mt-2 bg-[#ddd] h-[2px]" />
          </Box>
        );
      })}

      <ErrorComponent title={errorTitle} isShow={isShowError} />

      {isAdd && (
        <Box mt={2}>
          <Text.Title size="small">Khác</Text.Title>
          {optionNew.map((item, index) => (
            <div
              className="flex items-center flex-wrap mb-1 pb-1 border-b last:border-b-0 border-dashed border-[#4b5563]"
              key={index}
            >
              <Box className="w-[65%] pr-1 my-1">
                <label className="text-xs">*{placeholder}</label>
                <Input
                  required
                  name="name"
                  clearable
                  placeholder={placeholder}
                  size="small"
                  value={item?.name}
                  onChange={(e) =>
                    onHandleChange(index, e.target.name, e.target.value)
                  }
                />
              </Box>
              <Box className="w-[35%] pr-1 my-1">
                <label className="text-xs">* Số lượng</label>
                <Input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  name="quantity"
                  placeholder="Số lượng"
                  size="small"
                  value={item?.quantity}
                  onChange={(e) =>
                    onHandleChange(index, e.target.name, e.target.value)
                  }
                />
              </Box>
              <Box className="w-[50%] pr-1 my-1">
                <label className="text-xs">* Giá vật tư</label>
                <Input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  name="price"
                  placeholder="Giá vật tư"
                  size="small"
                  maxLength={20}
                  value={item?.price}
                  onChange={(e) =>
                    onHandleChange(index, e.target.name, e.target.value)
                  }
                />
              </Box>
              <Box className="w-[50%] pr-1 my-1">
                <label className="text-xs" for="price_labor">
                  * Giá nhân công
                </label>
                <Input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  name="price_labor"
                  placeholder="Giá nhân công"
                  size="small"
                  value={item?.price_labor}
                  onChange={(e) =>
                    onHandleChange(index, e.target.name, e.target.value)
                  }
                />
              </Box>
            </div>
          ))}

          <Box ml={2} className="flex items-center justify-end">
            <Button
              className="px-2 rounded-md flex items-center justify-center mr-2"
              disabled={optionNew.length <= 1}
              size="small"
              type="danger"
              variant="secondary"
              onClick={() => onAction("delete", optionNew)}
            >
              <FontAwesomeIcon icon={faMinus} size="xl" className="ml-1" />
            </Button>
            <Button
              className="px-2 rounded-md flex items-center justify-center"
              size="small"
              disabled={
                !optionNew[optionNew.length - 1].name ||
                !optionNew[optionNew.length - 1].quantity ||
                !optionNew[optionNew.length - 1].price
              }
              onClick={() => onAction("add", optionNew)}
            >
              <FontAwesomeIcon icon={faPlus} size="xl" className="ml-1" />
            </Button>
          </Box>
        </Box>
      )}
    </div>
  );
};

export default ListFeeComponent;
