import React from "react";
import { Box, Text } from "zmp-ui";

const InfoFeeCategory = ({ ticketFee }) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Box>
          <Text.Title size="normal">Tác vụ</Text.Title>
        </Box>
        <Box>
          <Text size="small">{ticketFee?.parent_fee_category_name}</Text>
        </Box>
      </div>
      <div className="flex items-center justify-between mt-3">
        <Box>
          <Text.Title size="normal">Hạng mục</Text.Title>
        </Box>
        <Box>
          <Text size="small">{ticketFee?.fee_category_name}</Text>
        </Box>
      </div>
    </>
  );
};

export default InfoFeeCategory;
