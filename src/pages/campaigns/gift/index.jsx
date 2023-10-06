import React, { useCallback, useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { Box, Page } from "zmp-ui";
import CampaignGiftItemComponent from "../../../components/campaign/item/gift";
import CampaignPromotionItemComponent from "../../../components/campaign/item/promotion";
import EmptyComponent from "../../../components/empty";
import CampaignFilterComponent from "../../../components/filter/campaignFilter";
import HeaderComponent from "../../../components/header";
import InfiniteScrollComponent from "../../../components/infiniteScrollComponent";
import { list } from "../../../services/api";
import { loadingState } from "../../../store/loading";
import { noticeErrorState } from "../../../store/notice";
import { LIST_CAMPAIGNS } from "../../../utils/constApiRoute";
import { GIFT, SETUP } from "../../../utils/enumAppType";

const CampaignGiftPage = () => {
  const setLoading = useSetRecoilState(loadingState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [filter, setFilter] = useState({
    start_date: null,
    end_date: null,
    keyword: "",
  });

  const getList = async (page) => {
    setLoading(true);

    await list(`${LIST_CAMPAIGNS}`, {
      type: SETUP,
      page: page,
      ...filter,
    })
      .then((response) => {
        setItems(response?.data?.apps);
        setLastPage(response?.data?.last_page);
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  const onActionFilter = useCallback((type, value) => {
    if (type === "cancel") return;
    setFilter({
      ...filter,
      start_date: value?.start_date,
      end_date: value?.end_date,
      keyword: value?.keyword,
    });
  });

  const closeFilter = useCallback((value) => {
    setFilter({
      ...filter,
      ...value,
    });
  });

  useEffect(() => {
    getList(page);
  }, [filter, page]);

  return (
    <Page className="page " style={{ paddingTop: "60px" }} hideScrollbar={true}>
      <HeaderComponent title="Chương trình đổi quà" />

      <Box className="bg-white rounded-md p-2">
        <CampaignFilterComponent
          filter={filter}
          action={onActionFilter}
          closeFilter={closeFilter}
        />
      </Box>

      {items.length > 0 && (
        <InfiniteScrollComponent
          dataLength={items.length}
          fetchMore={() => setPage((prev) => prev + 1)}
          hasMore={page < lastPage}
        >
          {items.map((item, index) => (
            <CampaignGiftItemComponent key={index} item={item} />
          ))}
        </InfiniteScrollComponent>
      )}

      <EmptyComponent title="thiết bị" length={items.length} />
    </Page>
  );
};

export default CampaignGiftPage;
