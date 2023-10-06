import React from "react";
import { Text } from "zmp-ui";
import { format_currency, notEmpty } from "../../../utils";

const InfoFeeMove = ({ item }) => {
  return (
    <>
      <table className="w-full">
        <thead>
          <tr className="border-2 border-t-0 border-l-0 border-r-0">
            <th className="text-left w-[65%] py-2">
              <Text.Title>Hạng mục di chuyển</Text.Title>
            </th>
            <th className="text-right w-[35%]">
              <Text.Title>Giá tiền (VNĐ)</Text.Title>
            </th>
          </tr>
        </thead>
        <tbody>
          {notEmpty(item) &&
            item.map((item, index) => {
              return (
                <tr
                  className="border-2 border-t-0 border-l-0 border-r-0 py-2 my-2"
                  key={index}
                >
                  <td className="text-left w-[65%] py-2">
                    <Text size="small">{item?.name}</Text>
                  </td>
                  <td className="text-right w-[35%]">
                    <Text size="small" className="font-bold">
                      {format_currency(item?.fee_total)}
                    </Text>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
};

export default InfoFeeMove;
