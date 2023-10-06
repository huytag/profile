import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { Text } from "zmp-ui";
import { list } from "../../../services/api";
import { loadingState } from "../../../store/loading";
import { noticeErrorState } from "../../../store/notice";
import { ITEMS } from "../../../utils/constApiRoute";
import EmptyComponent from "../../empty";
import TicketItemComponent from "../../items/ticket";

const TicketHistoryComponent = ({ itemId, inTab = false, limit = null }) => {
  const [tickets, setTickets] = useState([]);
  const noticeError = useSetRecoilState(noticeErrorState);
  const setLoading = useSetRecoilState(loadingState);

  const fetchTicketHistory = async () => {
    setLoading(true);
    await list(`${ITEMS}/${itemId}/ticket-histories`, { limit })
      .then((response) => {
        setTickets([...tickets, ...response.data.ticket_histories]);
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchTicketHistory();
  }, []);

  return (
    <div
      className={`text-4xl ${
        !inTab &&
        "mt-3 bg-white rounded-xl py-3 px-5 shadow-lg shadow-black-500/50"
      }`}
    >
      <div
        className={`flex justify-between items-center ${
          tickets.length <= 0 ? "hidden" : ""
        }`}
      >
        <Text.Title size="normal">Lịch sử sửa chữa</Text.Title>
        <Link to={`/tickets/${itemId}`}>
          <Text size="small" className="text-[#2b78e4]">
            Xem
          </Text>
        </Link>
      </div>
      <hr
        className={`block h-[2px] bg-[#ccc] mt-3 ${
          tickets.length <= 0 ? "hidden" : ""
        }`}
      />
      <div>
        {tickets.map((item, index) => (
          <TicketItemComponent item={item} id={itemId} key={index} />
        ))}
      </div>

      {tickets.length <= 0 && !inTab ? (
        <Text.Title size="normal">Lịch sử sửa chữa</Text.Title>
      ) : (
        ""
      )}

      <EmptyComponent title="lịch sử sửa chữa" length={tickets.length} />
    </div>
  );
};

export default TicketHistoryComponent;
