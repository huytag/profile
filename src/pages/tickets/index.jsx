import React, { useEffect, useState } from "react";
import { Page } from "zmp-ui";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { loadingState } from "../../store/loading";
import { noticeErrorState } from "../../store/notice";
import { STATUS_WAITING_CONFIRM } from "../../utils/enumTicket";
import HeaderComponent from "../../components/header";
import TicketComponent from "../../components/tickets";
import TabComponent from "../../components/tab";
import EmptyComponent from "../../components/empty";
import { list } from "../../services/api";
import { TICKETS } from "../../utils/constApiRoute";
import InfiniteScrollComponent from "../../components/infiniteScrollComponent";
import { showNavigationState } from "../../store/navigation";
import { TAB_ITEMS_TICKET } from "../../utils/enum/ticket";
import { tabStatusState } from "../../store/tab";

const TicketPage = () => {
  const setLoading = useSetRecoilState(loadingState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const setShowNavBottom = useSetRecoilState(showNavigationState);
  const { ticketTab } = useRecoilValue(tabStatusState);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [tickets, setTickets] = useState([]);

  const getList = async (page) => {
    setLoading(true);
    await list(TICKETS, { page, status: ticketTab })
      .then((response) => {
        const { tickets, last_page } = response.data;
        setTickets((prev) => (page === 1 ? tickets : [...prev, ...tickets]));
        setLastPage(last_page);
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setShowNavBottom(true);
    getList(page);
  }, [ticketTab, page]);

  return (
    <Page className="page" style={{ paddingTop: "60px" }} hideScrollbar={true}>
      <HeaderComponent title="Danh sách sửa chữa" />
      <TabComponent
        items={TAB_ITEMS_TICKET}
        action={() => setPage(1)}
        isActive={ticketTab}
        keyTab="ticketTab"
      />

      {tickets.length > 0 && (
        <InfiniteScrollComponent
          dataLength={tickets.length}
          fetchMore={() => setPage((prev) => prev + 1)}
          hasMore={page < lastPage}
        >
          <div className="mt-5">
            {tickets.map((item, index) => (
              <TicketComponent item={item} key={index} />
            ))}
          </div>
        </InfiniteScrollComponent>
      )}

      <EmptyComponent title="danh sách sửa chữa" length={tickets.length} />
    </Page>
  );
};

export default TicketPage;
