import React from "react";
import TicketApproveSupervisionComopnent from "../../../components/tickets/detail/supervision";
import TicketApprovePcComopnent from "../../../components/tickets/detail/pc";
import TicketApproveStaffComopnent from "../../../components/tickets/detail/staff";
import TicketApproveSupplierComopnent from "../../../components/tickets/detail/supplier";
import * as SubStatus from "../../../utils/enumTicket";

const TicketDetailPage = ({ ticket }) => {
  return (
    <>
      {/* APPROVE GSBH */}
      {ticket?.sub_status === SubStatus.SUB_WANTING_SUPERVISION_CONFIRM && (
        <TicketApproveSupervisionComopnent item={ticket} />
      )}

      {/* APPROVE P&C */}
      {ticket?.sub_status === SubStatus.SUB_WANTING_P_C_CONFIRM && (
        <TicketApprovePcComopnent item={ticket} />
      )}

      {/* APPROVE NCC */}
      {ticket?.sub_status === SubStatus.SUB_WANTING_DISTRIBUTION && (
        <TicketApproveSupplierComopnent item={ticket} />
      )}

      {/* APPROVE NVPT */}
      {ticket?.sub_status === SubStatus.SUB_WAITING_RECEIVE && (
        <TicketApproveStaffComopnent item={ticket} />
      )}

      {/* P&C APPROVE CALENDAR */}
      {/* {ticket?.sub_status === SUB_WAITING_APPOINTMENT_CONFIRMATION ? (
        <TicketApprovePcCalendarComopnent item={ticket} />
      ) : (
        ""
      )} */}
    </>
  );
};

export default TicketDetailPage;
