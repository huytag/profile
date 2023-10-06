import React from "react";
import { Text } from "zmp-ui";
import { format_currency } from "../../../utils";

const InfoTablePriceComponent = ({ item }) => {
  return (
    <>
      <div className="p-1 rounded-xl text-4xl">
        <Text.Title className={`mb-2`}>Luỹ kế hạng mục sửa chữa</Text.Title>
        <div
          className={`border-t-2 border-[#dddddd] pt-2 flex justify-between items-center`}
        >
          <Text.Title size="small">Tổng chi phí sửa chữa</Text.Title>
          <Text.Title size="small">
            {format_currency(item?.accumulate_fee_repair_total)}
          </Text.Title>
        </div>
        <div className="pt-1 pb-2 flex justify-between items-center">
          <Text.Title size="small">Tổng chi phí vận chuyển</Text.Title>
          <Text.Title size="small">
            {format_currency(item?.accumulate_fee_move_total)}
          </Text.Title>
        </div>
        <div className="border-t-2 border-[#dddddd] border-dashed pt-2 flex justify-between items-center">
          <Text.Title size="small">Tổng chi phí</Text.Title>
          <Text.Title size="small" className="text-[#6fa8dc]">
            {format_currency(item?.accumulate_fee_total)}
          </Text.Title>
        </div>
      </div>
    </>
  );
};

export default InfoTablePriceComponent;
