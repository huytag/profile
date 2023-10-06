import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { loadingState } from "../../../store/loading";
import { noticeErrorState } from "../../../store/notice";
import Tab2Component from "../../../components/tab2";
import InfiniteScrollComponent from "../../../components/infiniteScrollComponent";
import EmptyComponent from "../../../components/empty";
import { list } from "../../../services/api";
import ItemAppSetupResultComponent from "../../../components/campaign/item/setupResult";
import { SETUP_RESULT_DETAIL } from "../../../utils/constApiRoute";
import { TAB_ITEMS_SET_UP } from "../../../utils/enum/setup";
import { tabStatusState } from "../../../store/tab";
import { Box } from "zmp-ui";

const CampaignSetupResultsPage = () => {
  const setLoading = useSetRecoilState(loadingState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const { setupTab } = useRecoilValue(tabStatusState);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [items, setItems] = useState([]);

  const getList = (page) => {
    list(SETUP_RESULT_DETAIL, { page, status: setupTab })
      .then((response) => {
        page === 1
          ? setItems(response.data.setup_app_results)
          : setItems((prev) => [...prev, ...response.data.setup_app_results]);

        setLastPage(response.data.last_page);
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    getList(page);
  }, [setupTab, page]);

  return (
    <Box mt={2}>
      <Tab2Component
        items={TAB_ITEMS_SET_UP}
        widthContainer="w-full min-w-[600px]"
        widthChild="w-[25%]"
        action={() => setPage(1)}
        isActive={setupTab}
        keyTab="setupTab"
      />

      {items.length > 0 && (
        <InfiniteScrollComponent
          dataLength={items.length}
          fetchMore={() => setPage((prev) => prev + 1)}
          hasMore={page < lastPage}
        >
          <div className="mt-5">
            {items.map((item, index) => (
              <ItemAppSetupResultComponent item={item} key={index} />
            ))}
          </div>
        </InfiniteScrollComponent>
      )}

      <EmptyComponent title="danh sách yêu cầu" length={items.length} />
    </Box>
  );
};

export default CampaignSetupResultsPage;
