import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Page } from "zmp-ui";
import { useSetRecoilState } from "recoil";
import { loadingState } from "../../../store/loading";
import { noticeErrorState } from "../../../store/notice";
import { detail, list } from "../../../services/api";
import { TICKETS } from "../../../utils/constApiRoute";
import HeaderComponent from "../../../components/header";
import { showNavigationState } from "../../../store/navigation";
import TicketApproveCommonComopnent from "../../../components/tickets/detail/common";
import {
  METHOD_PC_REPAIR,
  METHOD_REPAIR,
  METHOD_WARRANTY,
  SUB_COMPLETE,
  SUB_SCHEDULED,
} from "../../../utils/enumTicket";
import TicketDetailPage from "../detail";
import TicketWarrantyDetailPage from "../warranty";
import TicketRepairDetailPage from "../repair";
import { isStaff, isSupplier } from "../../../services/hasPermission";

const TicketDetailCommonPage = () => {
  const { ticketId } = useParams();
  const setShowBottom = useSetRecoilState(showNavigationState);
  const setLoading = useSetRecoilState(loadingState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const [ticket, setTicket] = useState();
  const [ticketFee, setTicketFee] = useState([]);

  const getTicket = async () => {
    await detail(TICKETS, ticketId)
      .then((response) => {
        setTicket(response.data.ticket);
        checkNavigate(response.data.ticket);
        getTicketFree(response.data.ticket);
      })
      .catch((error) => noticeError(error?.message));
  };

  const checkNavigate = (item) => {
    if (item.sub_status < SUB_SCHEDULED) {
      setShowBottom(false);
      return;
    }

    setShowBottom(true);
  };

  const getTicketFree = async (ticket) => {
    if (
      (ticket?.method_type !== METHOD_REPAIR &&
        ticket?.method_type !== METHOD_PC_REPAIR) ||
      ticket?.sub_status !== SUB_COMPLETE
    ) {
      return;
    }

    await list(`${TICKETS}/${ticket?.id}/ticket-fee`)
      .then((response) => {
        setTicketFee(response.data.ticket_fee);
      })
      .catch((error) => console.log(error));
  };

  const loadApi = async () => {
    await getTicket();

    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    loadApi();
  }, []);

  return (
    <Page
      className="page px-3"
      style={{ paddingTop: "60px" }}
      hideScrollbar={true}
      restoreScroll={true}
    >
      <HeaderComponent title="Chi tiết yêu cầu" />
      {ticket && (
        <TicketApproveCommonComopnent item={ticket} ticketFee={ticketFee} />
      )}

      {/* Thực hiện yêu cầu sửa chữa */}
      {ticket?.sub_status < SUB_SCHEDULED && (
        <TicketDetailPage ticket={ticket} />
      )}

      {/* Bảo hành */}
      {ticket?.sub_status >= SUB_SCHEDULED &&
      ticket.method_type === METHOD_WARRANTY ? (
        <TicketWarrantyDetailPage ticket={ticket} />
      ) : (
        ""
      )}

      {/* Sữa chữa */}
      {ticket?.sub_status >= SUB_SCHEDULED &&
      (ticket.method_type === METHOD_REPAIR ||
        ticket.method_type === METHOD_PC_REPAIR) ? (
        <TicketRepairDetailPage ticket={ticket} ticketFee={ticketFee} />
      ) : (
        ""
      )}
    </Page>
  );
};

export default TicketDetailCommonPage;
