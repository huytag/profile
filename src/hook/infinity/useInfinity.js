import { useInfiniteQuery } from "@tanstack/react-query";

const useInfinity = (
  queryKey = ["supports"],
  fetchData = () => {},
  dataKey = "result",
  nextPageKey = "nextPage"
) => {
  let pageCurrent = 1;

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) => fetchData(pageParam),
    keepPreviousData: true,
    getNextPageParam: (lastPage, allPages) => {
      pageCurrent = lastPage?.[nextPageKey];
      return lastPage?.[nextPageKey];
    },
    select: (data) => data?.pages?.flatMap((page) => page?.[dataKey]),
    staleTime: 24 * 60 * 60 * 1000, // 1 day
  });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    pageNext: pageCurrent,
  };
};

export default useInfinity;
