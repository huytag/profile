import React from "react";
import { Box, Text } from "zmp-ui";
import { hasPermission } from "../../../services/hasPermission";
import { empty, notEmpty } from "../../../utils";
import {
  perItemDefault,
  PER_ASSET_ITEM_TICKET_HISTORY,
} from "../../../utils/enumPermission";
import {
  REFUSE_OPERATION_ERROR,
  SUB_CANCEL_REQUEST,
  SUB_COMPLETE,
  SUB_REFUSE_REPORT_AFTER,
  SUB_REFUSE_REPORT_BEFORE,
  SUB_SCHEDULED,
  SUB_WAITING_APPOINTMENT_CONFIRMATION,
} from "../../../utils/enumTicket";
import { STATUS_DENY } from "../../../utils/enumTicketFee";
import InfoCancelComponent from "../../cancel";
import InfoTicketComponent from "../../info";
import InfoEstimateComponent from "../../info/estimate";
import InfoTablePriceComponent from "../../info/tablePrice";
import TicketHistoryComponent from "../history";

const TicketApproveCommonComopnent = ({ item, ticketFee }) => {
  return (
    <>
      <Box>
        {item?.sub_status >= SUB_SCHEDULED &&
        item?.sub_status !== SUB_COMPLETE &&
        item?.sub_status !== SUB_CANCEL_REQUEST &&
        item?.sub_status !== REFUSE_OPERATION_ERROR &&
        item?.sub_status !== SUB_REFUSE_REPORT_AFTER &&
        item?.sub_status !== SUB_REFUSE_REPORT_BEFORE ? (
          <InfoEstimateComponent item={item} />
        ) : (
          ""
        )}

        {item?.sub_status === SUB_CANCEL_REQUEST ||
        item?.sub_status === REFUSE_OPERATION_ERROR ||
        item?.sub_status === SUB_REFUSE_REPORT_AFTER ||
        item?.sub_status === SUB_REFUSE_REPORT_BEFORE ? (
          <InfoCancelComponent item={item} />
        ) : (
          ""
        )}
        {notEmpty(ticketFee) && ticketFee?.status === STATUS_DENY ? (
          <InfoCancelComponent
            item={ticketFee}
            titleCancel="Cập nhật chi phí bị từ chối"
          />
        ) : (
          ""
        )}
        {item?.sub_status === SUB_WAITING_APPOINTMENT_CONFIRMATION && (
          <InfoEstimateComponent time={item?.estimate_date} />
        )}
        <div className="rounded-xl text-4xl mt-3 p-3 bg-white">
          <Text.Title className="mb-4">Yêu cầu sửa chữa</Text.Title>
          <InfoTicketComponent item={item} />
        </div>
        <div
          className={`rounded-xl text-4xl mt-3 p-3 bg-white ${
            !item?.item?.has_accumulate_permission && "hidden"
          }`}
        >
          {item?.item?.has_accumulate_permission && (
            <InfoTablePriceComponent item={item?.item} />
          )}
        </div>

        {empty(
          hasPermission([...perItemDefault, PER_ASSET_ITEM_TICKET_HISTORY])
        ) && <TicketHistoryComponent itemId={item?.item?.id} limit={3} />}
      </Box>
    </>
  );
};

export default TicketApproveCommonComopnent;
