import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { Input, Page, Text } from "zmp-ui";
import HeaderComponent from "../../../components/header";
import { detail, list } from "../../../services/api";
import { loadingState } from "../../../store/loading";
import { noticeErrorState } from "../../../store/notice";
import { SAMPLING_DETAIL } from "../../../utils/constApiRoute";
import EmptyComponent from "../../../components/empty";
import CampaignSamplingStoreItemComponent from "../../../components/campaign/item/samplingStore";
import _ from "lodash";
import { useParams } from "react-router";
import InfiniteScrollComponent from "../../../components/infiniteScrollComponent";
import { storeAppState } from "../../../store/campaign";

const CampaignSamplingStorePage = () => {
  const { campaignId } = useParams();
  const setAppStore = useSetRecoilState(storeAppState);
  const setLoading = useSetRecoilState(loadingState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const [item, setItem] = useState();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  let [keyWord, setKeyWord] = useState(null);

  const getDetail = async () => {
    await detail(`trade/sampling-apps`, campaignId)
      .then((response) => {
        setItem(response?.data?.sampling_app);
        setAppStore(response?.data?.sampling_app);
      })
      .catch((error) => noticeError(error?.message));
  };

  const getList = (page = 1, keyWord = null) => {
    setLoading(true);

    list(`${SAMPLING_DETAIL}/${campaignId}/outlets`, {
      page: page,
      keyword: keyWord,
    })
      .then((response) => {
        page === 1
          ? setItems(response?.data?.sampling_outlets)
          : setItems([...items, ...response?.data?.sampling_outlets]);
        setLastPage(response?.data?.last_page);
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  const inputChange = _.debounce((value) => {
    setPage(1);
    setKeyWord(value);
    getList(1, value);
  }, 500);

  useEffect(() => {
    getDetail();
  }, []);

  useEffect(() => {
    if (page === 1) return;

    getList(page, keyWord);
  }, [page]);

  return (
    <Page className="page" style={{ paddingTop: "60px" }} hideScrollbar={true}>
      <HeaderComponent title={item?.name} />

      <div className="bg-white p-3 rounded-lg shadow-lg">
        <Text.Title>{item?.name}</Text.Title>
        <Text className="pl-2 mt-2">
          ID: <span className="text-gray-400">{item?.code}</span>
        </Text>

        <div className="mt-3">
          <Input.Search
            placeholder="Nhập mã cửa hàng, tên cửa hàng"
            size="small"
            onChange={(e) => inputChange(e.target.value)}
          />
        </div>
      </div>

      <Text.Title className="mt-5">Danh sách cửa hàng</Text.Title>

      {items.length > 0 && (
        <InfiniteScrollComponent
          dataLength={items.length}
          fetchMore={() => setPage((prev) => prev + 1)}
          hasMore={page < lastPage}
        >
          {items.map((item, index) => (
            <CampaignSamplingStoreItemComponent key={index} item={item} />
          ))}
        </InfiniteScrollComponent>
      )}

      <EmptyComponent title="cửa hàng" length={items.length} />
    </Page>
  );
};

export default CampaignSamplingStorePage;
