import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Box, Text } from "zmp-ui";
import { parseUtcToLocal } from "../../utils";
import { labelText } from "../../utils/label";

const ItemSupportComponent = ({ item }) => {
  const labelClass = useMemo(
    () => labelText(item?.status ?? 0),
    [item?.status]
  );

  return (
    <Link to={`${item?.id}/`}>
      <Box className="p-3 text-4xl mt-3 flex flex-col group duration-500 bg-white rounded-xl shadow-lg shadow-black-500/50 ">
        <Box className="flex justify-between items-center">
          <Text.Title size="normal">{item?.category_title}</Text.Title>
          <span
            className={`w-[120px] rounded-md text-center text-white py-[2px] ${labelClass}`}
          >
            <Text size="xSmall">{item?.status_text}</Text>
          </span>
        </Box>
        <Box my={2}>
          <div className="flex items-center">
            <Text
              size="xSmall"
              className="text-gray-500 text-ellipsis overflow-hidden line-clamp-3"
            >
              {item?.activity_message}
            </Text>
          </div>
        </Box>

        <Box my={1}>
          <div className="flex justify-between items-center">
            <Text size="small">{item?.code}</Text>
            <Text size="small">
              {parseUtcToLocal(item?.updated_at, "DD/MM/YYYY HH:mm")}
            </Text>
          </div>
        </Box>
      </Box>
    </Link>
  );
};

export default ItemSupportComponent;
