import { useSetRecoilState } from "recoil";
import { list } from "../../services/api";
import { loadingState } from "../../store/loading";
import { noticeErrorState } from "../../store/notice";
import { SUPPORT } from "../../utils/constApiRoute";
import useInfinity from "./useInfinity";

const useSupports = (page, supportTab) => {
  const noticeError = useSetRecoilState(noticeErrorState);
  const setLoading = useSetRecoilState(loadingState);

  const getSupports = async (pageParam, supportTab) => {
    setLoading(true);
    try {
      const res = await list(`${SUPPORT}`, {
        page: pageParam,
        status: supportTab,
      });
      return {
        result: res?.data?.supports,
        nextPage:
          res?.data?.current_page < res?.data?.last_page
            ? res?.data?.current_page + 1
            : null,
      };
    } catch (error) {
      noticeError(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const { data, fetchNextPage, hasNextPage, pageNext } = useInfinity(
    [`supports`, { page, status: supportTab }],
    () => getSupports(pageNext, supportTab)
  );

  return {
    data,
    fetchNextPage,
    hasNextPage,
  };
};

export default useSupports;
