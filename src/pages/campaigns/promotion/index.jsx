import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Box, Page } from "zmp-ui";
import CampaignPromotionItemComponent from "../../../components/campaign/item/promotion";
import CampaignFilterComponent from "../../../components/filter/campaignFilter";
import HeaderComponent from "../../../components/header";
import { list } from "../../../services/api";
import { loadingState } from "../../../store/loading";
import { noticeErrorState } from "../../../store/notice";
import { LIST_CAMPAIGNS } from "../../../utils/constApiRoute";
import { PROMOTION } from "../../../utils/enumAppType";
import InfiniteScrollComponent from "../../../components/infiniteScrollComponent";
import EmptyComponent from "../../../components/empty";
import TabComponent from "../../../components/tab";
import moment from "moment";
import {
  STATUS_PROMOTION,
  TAB_ITEMS_PROMOTION,
} from "../../../utils/enum/promotion";
import { tabStatusState } from "../../../store/tab";

const CampaignPromotionPage = () => {
  const setLoading = useSetRecoilState(loadingState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const { promotionTab } = useRecoilValue(tabStatusState);
  const [items, setItems] = useState([]);
  const [filterItems, setFilterItems] = useState([]);
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
      type: PROMOTION,
      page,
      limit: 100,
      ...filter,
    })
      .then((response) => {
        page === 1
          ? setItems(response?.data?.apps)
          : setItems((prev) => [...prev, ...response?.data?.apps]);
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

  const handleFilter = () => {
    const currentDay = moment().valueOf();
    const newItems = items
      .filter((i) => {
        const startDay = moment(i?.start_date, "YYYY-MM-DD").valueOf();
        return startDay <= currentDay;
      })
      .filter((i) => {
        const isBetween = moment().isBetween(
          i?.start_date,
          i?.end_date,
          undefined,
          "[]"
        );

        return promotionTab === STATUS_PROMOTION.IN_PROGRESS
          ? isBetween
          : !isBetween;
      });
    setFilterItems(newItems);
  };

  useEffect(() => {
    handleFilter();
  }, [items, promotionTab]);

  useEffect(() => {
    getList(page);
  }, [filter, page]);

  return (
    <Page className="page" style={{ paddingTop: "60px" }} hideScrollbar={true}>
      <HeaderComponent title="Chương trình khuyến mãi" />

      <Box className="bg-white rounded-md p-2">
        <CampaignFilterComponent
          filter={filter}
          action={onActionFilter}
          closeFilter={closeFilter}
        />
      </Box>

      <TabComponent
        items={TAB_ITEMS_PROMOTION}
        cols={2}
        isActive={promotionTab}
        keyTab="promotionTab"
      />

      {filterItems.length > 0 && (
        <InfiniteScrollComponent
          dataLength={filterItems.length}
          fetchMore={() => setPage((prev) => prev + 1)}
          hasMore={page < lastPage}
        >
          {filterItems.map((item, index) => (
            <CampaignPromotionItemComponent key={index} item={item} />
          ))}
        </InfiniteScrollComponent>
      )}

      <EmptyComponent title="chương trình" length={filterItems.length} />
    </Page>
  );
};

export default CampaignPromotionPage;
