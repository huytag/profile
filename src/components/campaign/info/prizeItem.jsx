import React from "react";
import { Text } from "zmp-ui";
import IconPrize from "../../icon/Prize";

const CampaignPrizeItemComponent = ({
  item,
  isProduct = false,
  isPrize = false,
}) => {
  return (
    <div className={`flex items-center py-4 last:border-none`}>
      <div>
        <IconPrize className="w-14" />
      </div>

      <div className="ml-3">
        <Text.Title>
          {item?.product_desc ?? item?.display_app_bonus?.product_desc}
        </Text.Title>
        {isProduct && (
          <Text size="small" className="text-[#2b78e4] font-medium">
            {isProduct
              ? `Mức ${item?.level} - Số lượng nhập: ${item?.product_quantity}`
              : `Số lượng tặng: ${item?.product_quantity}`}
          </Text>
        )}

        {isPrize ? (
          <>
            <Text size="small" className="text-[#2b78e4] font-medium">
              Thưởng {item?.total_quantity} suất
            </Text>
            <Text size="small text-gray-400">
              Mức {item?.level} (x
              {item?.product_quantity} suất)
            </Text>
          </>
        ) : (
          <Text size="small">
            Mã hàng :{" "}
            <span className="text-gray-400 font-medium">
              {item?.product_code}
            </span>
          </Text>
        )}
      </div>
    </div>
  );
};

export default CampaignPrizeItemComponent;
