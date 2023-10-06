import React from "react";
import { Text } from "zmp-ui";
import { IconGift } from "../../icon";
import IconProduct from "../../icon/product";

const CampaignPrizeComponent = ({ items = [], isProduct = false }) => {
  return (
    <>
      {items.length > 0 &&
        items.map((item, index) => (
          <div className="flex items-center py-4 last:border-none" key={index}>
            <div>
              {isProduct ? (
                <IconProduct className="w-12" />
              ) : (
                <IconGift className="w-12" />
              )}
            </div>
            <div className="ml-3">
              <Text.Title>{item?.product_name}</Text.Title>
              <Text size="small" className="text-[#2b78e4] font-medium">
                {isProduct
                  ? `Mức ${item?.product_level} - Số lượng mua (hộp/chai/túi): ${item?.quantity}`
                  : `Số lượng tặng: ${item?.quantity}`}
              </Text>
              <Text size="small">
                Mã hàng :{" "}
                <span className="text-gray-400 font-medium">
                  {item?.product_code}
                </span>
              </Text>
            </div>
          </div>
        ))}
    </>
  );
};

export default CampaignPrizeComponent;
