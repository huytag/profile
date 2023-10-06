import React from "react";
import { Box, Text } from "zmp-ui";
import { format_currency } from "../../../utils";

const InfoFeeComponent = ({ item }) => {
  return (
    <Box>
      <Box
        my={2}
        className="border-2 border-[#333] border-dashed border-l-0 border-r-0"
      >
        <Box className="flex align-item-center justify-between" my={2}>
          <Text.Title size="small">Tổng chi phí sửa chữa</Text.Title>
          <Text.Title size="small">
            {format_currency(item?.fee_repair_total)}
          </Text.Title>
        </Box>
        <Box className="flex align-item-center justify-between" my={2}>
          <Text.Title size="small">Tổng chi phí di chuyển</Text.Title>
          <Text.Title size="small">
            {format_currency(item?.fee_move_total)}
          </Text.Title>
        </Box>
      </Box>
      <Box className="flex align-item-center justify-between" my={2}>
        <Text.Title size="small">Tổng cộng chi phí</Text.Title>
        <Text.Title size="small" className="text-cyan-500">
          {format_currency(item?.fee_total)}
        </Text.Title>
      </Box>
    </Box>
  );
};

export default InfoFeeComponent;
