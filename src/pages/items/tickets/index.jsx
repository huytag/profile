import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Page } from "zmp-ui";
import { useSetRecoilState } from "recoil";
import { noticeErrorState } from "../../../store/notice";
import { loadingState } from "../../../store/loading";
import { ITEMS } from "../../../utils/constApiRoute";
import { detail, list } from "../../../services/api";
import HeaderComponent from "../../../components/header";
import InfiniteScrollComponent from "../../../components/infiniteScrollComponent";
import TicketItemTableComponent from "../../../components/items/ticket/table";
import InfoTablePriceComponent from "../../../components/info/tablePrice";

const TicketsOfItemPage = () => {
  let { deviceId } = useParams();
  const noticeError = useSetRecoilState(noticeErrorState);
  const setLoading = useSetRecoilState(loadingState);
  const [tickets, setTickets] = useState([]);
  const [item, setItem] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchDetail = async () => {
    setLoading(true);
    await detail(ITEMS, deviceId)
      .then((response) => {
        setItem(response.data.item);
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  const fetchListRepair = async () => {
    setLoading(true);
    await list(`${ITEMS}/${deviceId}/ticket-histories`, { page })
      .then((response) => {
        page === 1
          ? setTickets(response?.data.ticket_histories)
          : setTickets((prev) => [...prev, ...response?.data.ticket_histories]);
        setPage(response?.data.current_page);
        setLastPage(response?.data.last_page);
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  useEffect(() => {
    fetchListRepair();
  }, [page]);

  return (
    <Page
      className="page bg-white"
      style={{ paddingTop: "60px" }}
      hideScrollbar={true}
    >
      <HeaderComponent title="Danh sách lịch sử sửa chữa" />

      {item?.has_accumulate_permission && (
        <div className="py-3 px-5 border border-[#ccc] text-4xl bg-white rounded-md shadow-lg shadow-black-500/50 mb-3">
          <InfoTablePriceComponent item={item} />
        </div>
      )}

      {tickets.length > 0 && (
        <InfiniteScrollComponent
          dataLength={tickets.length}
          fetchMore={() => setPage((prev) => prev + 1)}
          hasMore={page < lastPage}
        >
          <TicketItemTableComponent items={tickets} id={deviceId} />
        </InfiniteScrollComponent>
      )}
    </Page>
  );
};

export default TicketsOfItemPage;
