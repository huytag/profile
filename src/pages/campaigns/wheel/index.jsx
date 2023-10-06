import React, { useCallback, useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { Box, Page, Text } from "zmp-ui";
import CampaignPromotionItemComponent from "../../../components/campaign/item/promotion";
import CampaignFilterComponent from "../../../components/filter/campaignFilter";
import HeaderComponent from "../../../components/header";
import { list } from "../../../services/api";
import { loadingState } from "../../../store/loading";
import { noticeErrorState } from "../../../store/notice";
import { LIST_CAMPAIGNS } from "../../../utils/constApiRoute";
import InfiniteScrollComponent from "../../../components/infiniteScrollComponent";
import EmptyComponent from "../../../components/empty";
import { Link } from "react-router-dom";
import { LUCKY } from "../../../utils/enumAppType";
import IconGiftColor from "../../../components/icon/GiftColor";

const CampaignWheelPage = () => {
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
      type: LUCKY,
      page,
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

  const onActionFilter = (type, value) => {
    if (type === "cancel") return;

    setFilter({
      ...filter,
      start_date: value?.start_date,
      end_date: value?.start_date,
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

  return (
    <Page className="page " style={{ paddingTop: "60px" }} hideScrollbar={true}>
      <HeaderComponent title="Chương trình quay số" />

      <Box className="bg-white rounded-md p-2">
        <CampaignFilterComponent
          filter={filter}
          action={onActionFilter}
          closeFilter={closeFilter}
        />
      </Box>

      <Link
        to="/campaigns/wheel-history"
        className="flex items-center justify-end border-[#000000] mt-2 z-[1000]"
      >
        <IconGiftColor className="w-6 text-white transition-all hover:scale-125 focus:scale-125" />
        <Text.Title className="ml-1">Xem thưởng đã trúng</Text.Title>
      </Link>

      {items.length > 0 && (
        <InfiniteScrollComponent
          dataLength={items.length}
          fetchMore={() => setPage((prev) => prev + 1)}
          hasMore={page < lastPage}
        >
          {items.map((item, index) => (
            <CampaignPromotionItemComponent key={index} item={item} />
          ))}
        </InfiniteScrollComponent>
      )}

      <EmptyComponent title="thiết bị" length={items.length} />
    </Page>
  );
};

export default CampaignWheelPage;
