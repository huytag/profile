import React from "react";
import TicketWarrantyStaffComopnent from "../../../components/tickets/warranty/staff";
import * as SubStatus from "../../../utils/enumTicket";
import TicketWarrantyOperationApproveComopnent from "../../../components/tickets/warranty/operationApprove";
import TicketWarrantySuppervionComopnent from "../../../components/tickets/warranty/suppervions";
import TicketWarrantyPcComopnent from "../../../components/tickets/warranty/pc";
import TicketWarrantyOutletConfirmComopnent from "../../../components/tickets/warranty/outletConfirm";

const TicketWarrantyDetailPage = ({ ticket }) => {
  return (
    <>
      {/* NVPT Report */}
      {ticket?.sub_status === SubStatus.SUB_SCHEDULED ||
      ticket?.sub_status === SubStatus.REFUSE_OPERATION_ERROR ? (
        <TicketWarrantyStaffComopnent item={ticket} />
      ) : (
        ""
      )}

      {/* P&C Approve Operation */}
      {ticket?.sub_status === SubStatus.SUB_OPERATION_ERROR_APPROVAL && (
        <TicketWarrantyOperationApproveComopnent item={ticket} />
      )}

      {/* Suppervions Report */}
      {ticket?.sub_status === SubStatus.SUB_OPERATION_ERROR_VALIDATION ||
      ticket?.sub_status === SubStatus.SUB_REFUSE_REPORT_AFTER ? (
        <TicketWarrantySuppervionComopnent item={ticket} />
      ) : (
        ""
      )}

      {/* P&C Approve After */}
      {ticket?.sub_status === SubStatus.SUB_WANTING_RECEIPT_REPAIR ||
      ticket?.sub_status === SubStatus.SUB_WANTING_APPROVAL_COMPLETE ? (
        <TicketWarrantyPcComopnent item={ticket} />
      ) : (
        ""
      )}

      {/* Outlet Confirm */}
      {ticket?.sub_status === SubStatus.SUB_PROCESSED ||
      ticket?.sub_status === SubStatus.SUB_COMPLETE ||
      ticket?.sub_status === SubStatus.SUB_OUTLET_COMPLETE ? (
        <TicketWarrantyOutletConfirmComopnent item={ticket} />
      ) : (
        ""
      )}
    </>
  );
};

export default TicketWarrantyDetailPage;
