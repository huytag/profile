import React from "react";
import { Link } from "react-router-dom";
import { Text } from "zmp-ui";
import { format_currency, parseUtcToLocal } from "../../../utils";
import { IconWreanchColor } from "../../icon";

const TicketItemComponent = ({ item, isShowName = true }) => {
  return (
    <>
      <div className="border-b-2 last:border-0 group">
        <Link
          to={`/maintenance/${item?.id}`}
          className="flex items-center py-3"
        >
          <IconWreanchColor className="w-8" />
          <div className="ml-3">
            {isShowName && <Text size="small">{item?.supplier_name}</Text>}

            {!isShowName && (
              <>
                <Text size="small">{item?.supplier_name}</Text>
                <Text size="small">
                  {item?.fee_total
                    ? `Chi Phí: ${format_currency(item?.fee_total)} VNĐ`
                    : ""}
                </Text>
              </>
            )}
            <Text size="small" className="text-gray-500">
              {parseUtcToLocal(item?.completed_at)}
            </Text>
          </div>
        </Link>
      </div>
    </>
  );
};

export default TicketItemComponent;
