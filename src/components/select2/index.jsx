import React, { useState } from "react";
import { Text, Icon } from "zmp-ui";
import Select2 from "react-select";

const Select2Component = ({
  options = [],
  onSelect,
  isError,
  placeholder = "",
  required = false,
  index = null,
  isGetFull = false,
  defaultValue = null,
  isClearable = true,
  isSearchable = true,
  onLoadMore = () => {},
}) => {
  const [isHidden, setIsHidden] = useState(null);

  return (
    <>
      <Select2
        className="basic-single text-lg"
        classNamePrefix="select2"
        defaultValue={defaultValue}
        isClearable={isClearable}
        isSearchable={isSearchable}
        placeholder={placeholder}
        name="color"
        options={options}
        onMenuScrollToBottom={onLoadMore}
        onChange={(e) => {
          setIsHidden(e?.value);

          if (isGetFull) {
            onSelect(e);
            return;
          }

          if (!index || !e) {
            onSelect(e?.value ?? null);
            return;
          }

          onSelect(e[index] ?? null);
        }}
        noOptionsMessage={() => "Không có dữ liệu"}
      />
      <div
        className={`flex items-center mt-2 text-red-600 ${
          !isError || isHidden ? "hidden" : ""
        } ${!required && "hidden"}`}
      >
        <Icon icon="zi-warning-solid" size={20} style={{ color: "#DC2626" }} />
        <Text size="xxSmall" className="ml-1">
          Vui lòng chọn
        </Text>
      </div>
    </>
  );
};

export default Select2Component;
