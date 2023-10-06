import React from "react";
import { Box, Button, Icon } from "zmp-ui";

const LabelFilterComponent = ({ filter, allTypeFilter, action }) => {
  return (
    <Box>
      {allTypeFilter.map((typeFilter, index) => {
        return (
          filter[typeFilter?.key] && (
            <Box
              className="inline-flex bg-slate-300 rounded-xl px-2 py-1 text-[#487bce] mt-1 mr-1"
              key={index}
            >
              <span className="text-sm">{`${typeFilter?.label}: ${
                filter[typeFilter?.key]
              }`}</span>
              <Button
                className="ml-1 w-[20px] h-[20px]"
                size="small"
                icon={<Icon icon="zi-close" className="w-[20px] h-[20px]" />}
                onClick={() =>
                  action({
                    ...filter,
                    [typeFilter?.key]: null,
                  })
                }
              ></Button>
            </Box>
          )
        );
      })}
    </Box>
  );
};

export default LabelFilterComponent;
