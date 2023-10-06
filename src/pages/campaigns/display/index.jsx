import React, { useCallback, useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Box, Page } from "zmp-ui";
import CampaignFilterComponent from "../../../components/filter/campaignFilter";
import HeaderComponent from "../../../components/header";
import { list } from "../../../services/api";
import { loadingState } from "../../../store/loading";
import { noticeErrorState } from "../../../store/notice";
import { DISPLAY_DETAIL } from "../../../utils/constApiRoute";
import TabComponent from "../../../components/tab";
import EmptyComponent from "../../../components/empty";
import CampaignDisplayItemComponent from "../../../components/campaign/item/display";
import InfiniteScrollComponent from "../../../components/infiniteScrollComponent";
import {
  STATUS_CAMPAIGN,
  TAB_ITEMS_CAMPAIGN,
} from "../../../utils/enum/campaign";
import { tabStatusState } from "../../../store/tab";
import moment from "moment";
import {
  isOutlet,
  isSaleman,
  isSupervisor,
} from "../../../services/hasPermission";

const CampaignDisplayPage = () => {
  const setLoading = useSetRecoilState(loadingState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const { displayTab } = useRecoilValue(tabStatusState);
  const [items, setItems] = useState([]);
  const [filterItems, setFilterItems] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [filter, setFilter] = useState({
    start_date: null,
    end_date: null,
    keyword: null,
  });

  const getList = async (page) => {
    setLoading(true);

    await list(`${DISPLAY_DETAIL}`, {
      page: page,
      limit: 20,
      ...filter,
    })
      .then((response) => {
        page === 1
          ? setItems(response?.data?.apps)
          : setItems([...items, ...response?.data?.apps]);

        setLastPage(response?.data?.last_page);
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  const onActionFilter = (type, value) => {
    if (type === "cancel") return;

    setFilter({
      ...filter,
      start_date: value?.start_date,
      end_date: value?.end_date,
      keyword: value?.keyword,
    });
  };

  const closeFilter = useCallback((value) => {
    setFilter({
      ...filter,
      ...value,
    });
  });

  useEffect(() => {
    getList(page);
  }, [filter, page]);

  const handleFilter = () => {
    if (!isOutlet()) {
      return setFilterItems(items);
    }

    const currentDay = moment().valueOf();
    const newItems = items.filter((i) => {
      const endDay = moment(i?.end_date, "YYYY-MM-DD").valueOf();

      switch (displayTab) {
        case STATUS_CAMPAIGN.NOT_JOIN:
          return !i?.display_app_result?.registered;

        case STATUS_CAMPAIGN.IN_PROGRESS:
          return i?.display_app_result?.registered && endDay > currentDay;

        case STATUS_CAMPAIGN.HISTORY:
          return i?.display_app_result?.registered && endDay < currentDay;

        default:
          break;
      }
    });

    setFilterItems(newItems);
  };

  useEffect(() => {
    handleFilter();
  }, [items, displayTab]);

  return (
    <Page className="page " style={{ paddingTop: "60px" }} hideScrollbar={true}>
      <HeaderComponent title="Chương trình trưng bày" />
      <Box className="bg-white rounded-md p-2">
        <CampaignFilterComponent
          filter={filter}
          action={onActionFilter}
          closeFilter={closeFilter}
        />
      </Box>
      {isOutlet() && (
        <TabComponent
          items={TAB_ITEMS_CAMPAIGN}
          isActive={displayTab}
          keyTab="displayTab"
        />
      )}
      {filterItems.length > 0 && (
        <InfiniteScrollComponent
          dataLength={filterItems.length}
          fetchMore={() => setPage((prev) => prev + 1)}
          hasMore={page < lastPage}
        >
          {filterItems.map((item, index) => (
            <CampaignDisplayItemComponent key={index} item={item} />
          ))}
        </InfiniteScrollComponent>
      )}
      <EmptyComponent
        title="chương trình trưng bày"
        length={filterItems.length}
      />
    </Page>
  );
};

export default CampaignDisplayPage;
