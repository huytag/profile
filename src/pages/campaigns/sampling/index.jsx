import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { Page, Text } from "zmp-ui";
import HeaderComponent from "../../../components/header";
import { list } from "../../../services/api";
import { loadingState } from "../../../store/loading";
import { noticeErrorState } from "../../../store/notice";
import { SAMPLING_DETAIL } from "../../../utils/constApiRoute";
import EmptyComponent from "../../../components/empty";
import CampaignSamplingItemComponent from "../../../components/campaign/item/sampling";
import InfiniteScrollComponent from "../../../components/infiniteScrollComponent";

const CampaignSamplingPage = () => {
  const setLoading = useSetRecoilState(loadingState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const getList = async () => {
    await list(`${SAMPLING_DETAIL}`, { page: page })
      .then((response) => {
        setItems([...items, ...response?.data?.sampling_apps]);
        setLastPage(response?.data?.last_page);
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    getList();
  }, [page]);

  return (
    <Page className="page " style={{ paddingTop: "60px" }} hideScrollbar={true}>
      <HeaderComponent title="Chương trình sampling" />

      <Text.Title>Danh sách chương trình</Text.Title>

      {items.length > 0 && (
        <InfiniteScrollComponent
          dataLength={items.length}
          fetchMore={() => setPage((prev) => prev + 1)}
          hasMore={page < lastPage}
        >
          {items.map((item, index) => (
            <CampaignSamplingItemComponent key={index} item={item} />
          ))}
        </InfiniteScrollComponent>
      )}

      <EmptyComponent title="chương trình sampling" length={items.length} />
    </Page>
  );
};

export default CampaignSamplingPage;
