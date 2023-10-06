import React, { useEffect, useState } from "react";
import { Box, Page, Text, Input } from "zmp-ui";
import HeaderComponent from "../../../components/header";
import ItemAccumulationComponent from "../../../components/campaign/accumulation/item";
import { list } from "../../../services/api";
import { ACCUMULATE } from "../../../utils/enumAppType";
import { noticeErrorState } from "../../../store/notice";
import { loadingState } from "../../../store/loading";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { LIST_CAMPAIGNS } from "../../../utils/constApiRoute";
import InfiniteScrollComponent from "../../../components/infiniteScrollComponent";
import EmptyComponent from "../../../components/empty";
import _ from "lodash";
import TabComponent from "../../../components/tab";
import moment from "moment";
import {
  STATUS_CAMPAIGN,
  TAB_ITEMS_CAMPAIGN,
} from "../../../utils/enum/campaign";
import { tabStatusState } from "../../../store/tab";

const CampaignAccumulationPage = () => {
  const setLoading = useSetRecoilState(loadingState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const { accumulationTab } = useRecoilValue(tabStatusState);
  const [items, setItems] = useState([]);
  const [filterItems, setFilterItems] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [keyword, setKeyword] = useState("");

  const fetchItems = (page = 1, keyword) => {
    setLoading(true);

    list(LIST_CAMPAIGNS, { type: ACCUMULATE, page, keyword })
      .then((res) => {
        page === 1
          ? setItems(res.data.apps)
          : setItems([...items, ...res.data.apps]);

        setPage(res.data.current_page);
        setLastPage(res.data.last_page);
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  const handleSearch = _.debounce((e) => {
    setKeyword(e.target.value);
    fetchItems(1, e.target.value);
  }, 450);

  useEffect(() => {
    const filterItems = _.filter(items, (i) => {
      if (accumulationTab === STATUS_CAMPAIGN.ALL) return i;

      const isBetween = moment().isBetween(
        i?.start_date,
        i?.end_date,
        undefined,
        "[]"
      );

      return accumulationTab === STATUS_CAMPAIGN.IN_PROGRESS
        ? isBetween
        : !isBetween;
    });

    setFilterItems(filterItems);
  }, [accumulationTab, items]);

  useEffect(() => {
    fetchItems(page, keyword);
  }, [page]);

  return (
    <Page
      className="page px-2"
      style={{ paddingTop: "60px" }}
      hideScrollbar={true}
    >
      <HeaderComponent title="Chương trình tích luỹ" />
      <Box className="px-5 py-3 text-4xl items-center mt-4 bg-white rounded-xl shadow-lg shadow-black-500/50">
        <Text.Title>Danh sách chương trình</Text.Title>
        <Box mt={2} className="flex items-center">
          <Input.Search
            type="text"
            placeholder="Nhập mã/tên chương trình"
            clearable
            onChange={handleSearch}
            className="rounded-full p-0 m-0"
          />
        </Box>
      </Box>
      <Box>
        // TODO: change enums tab
        <TabComponent
          items={TAB_ITEMS_CAMPAIGN}
          isActive={accumulationTab}
          keyTab="accumulationTab"
        />
      </Box>
      {filterItems.length > 0 && (
        <InfiniteScrollComponent
          dataLength={filterItems.length}
          fetchMore={() => setPage((prev) => prev + 1)}
          hasMore={page < lastPage}
        >
          {filterItems.map((item, index) => (
            <ItemAccumulationComponent item={item} key={index} />
          ))}
        </InfiniteScrollComponent>
      )}

      <EmptyComponent title="chương trình" length={filterItems.length} />
    </Page>
  );
};

export default CampaignAccumulationPage;
