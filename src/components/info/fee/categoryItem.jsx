import React from "react";
import { Text } from "zmp-ui";
import { hasPermission } from "../../../services/hasPermission";
import { format_currency, notEmpty } from "../../../utils";
import {
  perTicketDefault,
  PER_ASSET_TICKET_FEE_CONFIRM,
  PER_ASSET_TICKET_FEE_UPDATE,
} from "../../../utils/enumPermission";

const InfoFeeCategoryItem = ({ item }) => {
  return (
    <>
      <table className="w-full">
        <thead>
          <tr className="border-2 border-t-0 border-l-0 border-r-0">
            <th className="text-left w-[50%] py-2">
              <Text.Title size="normal">Đơn vị sửa chữa</Text.Title>
            </th>
            <th className=" w-[15%] py-2">
              <Text.Title>SL</Text.Title>
            </th>
            <th
              className={`text-right w-[35%]" ${hasPermission([
                ...perTicketDefault,
                PER_ASSET_TICKET_FEE_CONFIRM,
                PER_ASSET_TICKET_FEE_UPDATE,
              ])}`}
            >
              <Text.Title>Giá tiền (VNĐ)</Text.Title>
            </th>
          </tr>
        </thead>
        <tbody>
          {notEmpty(item) &&
            item.map((categoryItem, index) => {
              return (
                <tr
                  className="border-2 border-t-0 border-l-0 border-r-0 py-2 my-2"
                  key={index}
                >
                  <td className="text-left w-[50%] py-2">
                    <Text size="small">{categoryItem?.name}</Text>
                  </td>
                  <td className="text-center w-[15%] py-2">
                    <Text size="small">{categoryItem?.quantity}</Text>
                  </td>
                  <td
                    className={`text-right w-[35%]" ${hasPermission([
                      ...perTicketDefault,
                      PER_ASSET_TICKET_FEE_CONFIRM,
                      PER_ASSET_TICKET_FEE_UPDATE,
                    ])}`}
                  >
                    <Text size="small" className="font-bold">
                      {format_currency(categoryItem?.fee_total)}
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

export default InfoFeeCategoryItem;
