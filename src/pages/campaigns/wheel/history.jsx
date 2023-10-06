import React, { useCallback, useEffect, useState } from "react";
import { Button, Page, Text } from "zmp-ui";
import HeaderComponent from "../../../components/header";
import TabComponent from "../../../components/tab";
import noImage from "../../../static/no-image.png";
import EmptyComponent from "../../../components/empty";
import InfiniteScrollComponent from "../../../components/infiniteScrollComponent";
import { parseUtcToLocal } from "../../../utils";
import TextBaseLineComponent from "../../../components/textBaseLine";
import ModalApproveComponent from "../../../components/modal/approve";
import { apiClient, list } from "../../../services/api";
import { loadingState } from "../../../store/loading";
import { noticeErrorState, noticeSuccessState } from "../../../store/notice";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { LUCKY_APP } from "../../../utils/constApiRoute";
import useNavigateCustomize from "../../../hook/navigate/useNavigateCustom";
import useQueryParams from "../../../hook/query/useQueryParams";
import { canViewReport } from "../../../services/hasPermission";
import { PER_TRADE_LUCKY_REPORT_VIEW } from "../../../utils/enumPermission";
import { TAB_ITEMS_WHEEL_HISTORY } from "../../../utils/enum/wheelHistory";
import { tabStatusState } from "../../../store/tab";

const CampaignWheelHistoryPage = () => {
  const setLoading = useSetRecoilState(loadingState);
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const reload = useNavigateCustomize();
  const { wheelHistoryTab } = useRecoilValue(tabStatusState);
  const [histories, setHistories] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState(null);
  const query = useQueryParams();
  const customerId = query.get("customerId");

  const onConfirm = useCallback(async (value) => {
    if (value === "cancel") {
      setIsOpen(false);
      return;
    }

    setLoading(true);
    await apiClient
      .put(`${LUCKY_APP}/${id}/confirm`)
      .then((res) => {
        noticeSuccess("Đã xác nhận.");
        reload();
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  });

  const fetchItems = async () => {
    setLoading(true);
    const is_paid_out =
      wheelHistoryTab == 2 ? true : wheelHistoryTab == 1 ? false : null;
    await list(`${LUCKY_APP}/histories`, {
      page,
      is_paid_out,
      customer_id: customerId,
    })
      .then((response) => {
        const { lucky_app_histories, last_page } = response.data;
        setHistories((prev) =>
          page === 1 ? lucky_app_histories : [...prev, ...lucky_app_histories]
        );
        setLastPage(last_page);
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, [page, wheelHistoryTab]);

  return (
    <Page className="page " style={{ paddingTop: "60px" }} hideScrollbar={true}>
      <HeaderComponent title="Lịch sử trúng thưởng" />

      <TabComponent
        items={TAB_ITEMS_WHEEL_HISTORY}
        cols={3}
        action={() => setPage(1)}
        isActive={wheelHistoryTab}
        keyTab="wheelHistoryTab"
      />

      {histories.length > 0 && (
        <InfiniteScrollComponent
          dataLength={histories.length}
          fetchMore={() => setPage((prev) => prev + 1)}
          hasMore={page < lastPage}
        >
          {histories.map((item, index) => (
            <div
              className="p-3 text-4xl mt-3  group duration-500 bg-white rounded-xl shadow-lg shadow-black-500/50"
              key={index}
            >
              <div className="flex">
                <img
                  src={item?.coupon_img ?? noImage}
                  alt="alt source"
                  className="w-full max-w-[25vw] h-[25vw] aspect-square object-cover"
                />
                <div style={{ width: `calc(100% - 28vw)` }} className="ml-auto">
                  <Text.Title size="normal">{item?.coupon}</Text.Title>

                  <TextBaseLineComponent
                    title="Ngày"
                    value={parseUtcToLocal(item?.created_at)}
                  />
                  <TextBaseLineComponent
                    title="Trạng thái"
                    value={
                      item?.is_paid_out ? "Đã nhận thưởng" : "Chờ nhận thưởng"
                    }
                    mt={1}
                  />
                  <TextBaseLineComponent
                    title="Mã trúng thưởng"
                    value={item?.id}
                    mt={1}
                  />
                </div>
              </div>
              {!item.is_paid_out &&
                !canViewReport(PER_TRADE_LUCKY_REPORT_VIEW) && (
                  <Button
                    size="small"
                    fullWidth
                    className="mt-4"
                    onClick={() => {
                      setIsOpen(true);
                      setId(item?.id);
                    }}
                  >
                    Xác nhận
                  </Button>
                )}
            </div>
          ))}
        </InfiniteScrollComponent>
      )}

      <ModalApproveComponent
        isVisible={isOpen}
        title="Xác nhận đã trao thưởng"
        description="Nhân viên bán hàng đã trao thưởng tới bạn?"
        action={(value) => onConfirm(value)}
      />

      <EmptyComponent title="lịch sử trúng thưởng" length={histories.length} />
    </Page>
  );
};

export default CampaignWheelHistoryPage;
