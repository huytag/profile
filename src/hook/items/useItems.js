import { useQuery } from "@tanstack/react-query";
import { list } from "../../services/api";
import { ITEMS } from "../../utils/constApiRoute";
import { QR_ITEMS_LIST, TIME_CACHE } from "../../utils/enumQuery";

const getList = async (page = 1) => {
  const data = await list(ITEMS, { page });

  return data?.data;
};

export default function useItems(page) {
  return useQuery([QR_ITEMS_LIST, page], () => getList(page), {
    cacheTime: TIME_CACHE,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    staleTime: TIME_CACHE,
  });
}
