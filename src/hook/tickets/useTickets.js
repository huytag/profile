import { useQuery } from "@tanstack/react-query";
import { list } from "../../services/api";
import { TICKETS } from "../../utils/constApiRoute";
import { QR_TICKETS_LIST, TIME_CACHE } from "../../utils/enumQuery";
import { STATUS_WAITING_CONFIRM } from "../../utils/enumTicket";

const getList = async (page = 1, status = STATUS_WAITING_CONFIRM) => {
  const data = await list(TICKETS, { page, status });

  return data?.data;
};

export default function useTickets(page, status) {
  return useQuery(
    [QR_TICKETS_LIST, page, status],
    () => getList(page, status),
    {
      cacheTime: TIME_CACHE,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      staleTime: TIME_CACHE,
    }
  );
}
