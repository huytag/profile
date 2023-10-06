import React from "react";
import { format_currency, isOverTime, parseUtcToLocal } from "../../../utils";

// TODO api
const TicketItemTableComponent = ({ items }) => {
  return (
    <div className="scrollbar relative overflow-x-scroll ">
      <table className="table border-collapse">
        <thead className="text-left">
          <tr className="bg-[#dadada] shadow-md shadow-black-300/30">
            <th className="pl-1 text-center py-1" style={{ minWidth: "50px" }}>
              STT
            </th>
            <th className="pl-1" style={{ minWidth: "100px" }}>
              Ngày
            </th>
            <th className="pl-1" style={{ minWidth: "150px" }}>
              Diễn giải
            </th>
            <th className="pl-1" style={{ minWidth: "80px" }}>
              Chi phí
            </th>
            <th className="pl-1" style={{ minWidth: "200px" }}>
              Ngày hết hạn bảo hành
            </th>
            <th className="pl-1" style={{ minWidth: "130px" }}>
              Nhà cung cấp
            </th>
          </tr>
        </thead>
        <tbody>
          {items?.map((item, index) => (
            <tr
              className={`shadow-md shadow-black-300/30  ${
                isOverTime(item?.completed_at)
                  ? "even:bg-[#fef08a] odd:bg-[#fef3c7]"
                  : "even:bg-[#eee] odd:bg-[#fff]"
              } `}
              key={index}
            >
              <td
                className="pl-1 text-center py-2"
                style={{ minWidth: "50px" }}
              >
                {index + 1}
              </td>
              <td className="pl-1">
                {parseUtcToLocal(item?.created_at, "DD-MM-YYYY")}
              </td>
              <td className="pl-1">{item?.content}</td>
              <td className="pl-1">{format_currency(item?.fee_total)}</td>
              <td className="pl-1">
                {parseUtcToLocal(item?.completed_at, "DD-MM-YYYY")}
              </td>
              <td className="pl-1">{item?.supplier_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketItemTableComponent;
