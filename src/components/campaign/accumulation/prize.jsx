import React from "react";
import { Box, Checkbox, Text } from "zmp-ui";
import { format_currency } from "../../../utils";

const AccumulationPrizeComponent = ({
  prize,
  action,
  isResult = false,
  idChecked = null,
}) => {
  return (
    <Box className="flex items-center justify-between my-2 py-2 border-dashed border-slate-500 last:border-none border-b-2">
      <Box>
        <div className="flex flex-col my-2">
          <Text.Title size="small" className="font-semibold mb-1">
            Mức {prize?.target_level}:
          </Text.Title>
          <Text size="xSmall" className="ml-2 text-gray-500">
            {prize?.accumulate_type}: {format_currency(prize?.target_value)}
          </Text>
        </div>
        <div className="flex flex-col my-2">
          <Text.Title size="small" className="font-semibold mb-1">
            Mức thưởng
          </Text.Title>
          <Text size="xSmall" className="ml-2 text-gray-500">
            {prize?.bonus_text} x{prize?.bonus_value}
          </Text>
        </div>
      </Box>

      {!isResult && (
        <div className="flex items-center mt-1">
          <Checkbox
            checked={prize.id === idChecked}
            onChange={(e) => {
              action({
                checked: e.target.checked,
                id: prize?.id,
              });
            }}
          />
        </div>
      )}
    </Box>
  );
};

export default AccumulationPrizeComponent;
