import React from "react";
import { Text, Icon } from "zmp-ui";
import { AsyncPaginate } from "react-select-async-paginate";

const AsyncSelectComponent = ({
  fetchOptions = () => {},
  defaultOptions = [],
  defaultValue = null,
  onSelect,
  placeholder = "",
  required = false,
  index = null,
  isGetFull = false,
  isClearable = true,
  isError,
}) => {
  const loadOptions = async (search = "", prevOptions, { page, getData }) => {
    let optionsData = getData ? await getData(page) : [];

    if (prevOptions && optionsData) {
      optionsData = [...prevOptions, ...optionsData];
    }

    let hasMore = false;
    if (search) {
      optionsData = optionsData.filter(({ label }) =>
        label.toLowerCase().includes(search.toLowerCase())
      );
    } else {
      hasMore = optionsData.length >= prevOptions.length + 10;
    }

    const options = optionsData.slice(
      prevOptions.length,
      prevOptions.length + 10
    );

    return {
      options,
      hasMore,
      additional: {
        page: search ? 1 : page + 1,
        getData,
      },
    };
  };

  return (
    <>
      <AsyncPaginate
        className="basic-single text-lg"
        classNamePrefix="select2"
        loadOptions={loadOptions}
        onChange={(e) => {
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
        defaultOptions={defaultOptions}
        defaultValue={defaultValue}
        additional={{
          page: 1,
          getData: fetchOptions,
        }}
        isClearable={isClearable}
        isSearchable={true}
        placeholder={placeholder}
        noOptionsMessage={() => "Không có dữ liệu"}
      />
      <div
        className={`flex items-center mt-2 text-red-600 ${!isError} ${
          !required && "hidden"
        }`}
      >
        <Icon icon="zi-warning-solid" size={20} style={{ color: "#DC2626" }} />
        <Text size="xxSmall" className="ml-1">
          Vui lòng chọn
        </Text>
      </div>
    </>
  );
};

export default AsyncSelectComponent;
