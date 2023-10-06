import React, { useEffect, useState } from "react";
import * as SubStatus from "../../../utils/enumTicket";
import ReportRepairCompleteComponent from "../../../components/tickets/repair/reportRepairComplete";
import InfoApproveTicketBeforeRepairComponent from "../../../components/info/repair/approveBefore";
import TicketReportBeforeRepairComponent from "../../../components/tickets/repair/reportBefore";
import ApproveReportBeforeRepairComponent from "../../../components/tickets/repair/approveReportBefore";
import StaffReportAfterRepairComponent from "../../../components/tickets/repair/staffReportAfter";
import AccordionComponent from "../../../components/accordion";
import ApproveReportAfterRepairComponent from "../../../components/tickets/repair/approveReportAfter";
import FeeUpdateComponent from "../../../components/tickets/repair/feeUpdate";

const TicketRepairDetailPage = ({ ticket, ticketFee }) => {
  const [listAcc, setListAcc] = useState([]);

  useEffect(() => {
    switch (ticket?.sub_status) {
      case SubStatus.SUB_SCHEDULED:
      case SubStatus.SUB_REFUSE_REPORT_BEFORE:
        if (!ticket?.can_report_before) return;

        setListAcc([
          {
            title: "Báo cáo trước sửa chữa",
            component: <TicketReportBeforeRepairComponent item={ticket} />,
            key: "info-before-repair",
            bg: true,
          },
        ]);
        break;

      case SubStatus.SUB_WANTING_RECEIPT_REPAIR:
        setListAcc([
          {
            title: "Báo cáo trước sửa chữa",
            component: <ApproveReportBeforeRepairComponent item={ticket} />,
            key: "info-before-repair",
            bg: true,
          },
        ]);
        break;

      case SubStatus.SUB_UNDER_REPAIR:
      case SubStatus.SUB_REFUSE_REPORT_AFTER:
        if (!ticket?.can_report_after) {
          return;
        }

        setListAcc([
          {
            title: "Báo cáo trước sửa chữa",
            component: <InfoApproveTicketBeforeRepairComponent item={ticket} />,
            key: "info-before-repair",
            bg: true,
          },
          {
            title: "Báo cáo sau sửa chữa",
            component: <StaffReportAfterRepairComponent item={ticket} />,
            key: "info-after-repair",
            bg: true,
          },
        ]);
        break;

      default:
        break;
    }
  }, []);

  return (
    <>
      {ticket?.sub_status !== SubStatus.SUB_PROCESSED ||
      ticket?.sub_status !== SubStatus.SUB_WANTING_APPROVAL_COMPLETE ? (
        <AccordionComponent
          list={listAcc}
          indexActive={
            ticket?.sub_status === SubStatus.SUB_UNDER_REPAIR ||
            ticket?.sub_status === SubStatus.SUB_REFUSE_REPORT_AFTER
              ? 1
              : 0
          }
        />
      ) : (
        ""
      )}

      {ticket?.sub_status === SubStatus.SUB_WANTING_APPROVAL_COMPLETE && (
        <ApproveReportAfterRepairComponent item={ticket} />
      )}

      {ticket?.sub_status === SubStatus.SUB_PROCESSED ||
      ticket?.sub_status === SubStatus.SUB_OUTLET_COMPLETE ? (
        <ReportRepairCompleteComponent item={ticket} />
      ) : (
        ""
      )}

      {ticket?.sub_status === SubStatus.SUB_COMPLETE && (
        <FeeUpdateComponent item={ticket} ticketFee={ticketFee} />
      )}
    </>
  );
};

export default TicketRepairDetailPage;
