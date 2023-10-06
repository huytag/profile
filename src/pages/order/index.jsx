import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Icon, Page, Text, useNavigate } from "zmp-ui";
import EmptyComponent from "../../components/empty";
import HeaderComponent from "../../components/header";
import InfiniteScrollComponent from "../../components/infiniteScrollComponent";
import Tab2Component from "../../components/tab2";
import TextBaseLineComponent from "../../components/textBaseLine";
import { list } from "../../services/api";
import { loadingState } from "../../store/loading";
import { noticeErrorState } from "../../store/notice";
import { format_currency, parseUtcToLocal } from "../../utils";
import { ORDER_CREATE, ORDER_SETTING } from "../../utils/constApiRoute";
import Draggable from "react-draggable";
import moment from "moment";
import { setOrderDefaultState } from "../../store/order";
import { TAB_ITEMS_ORDER } from "../../utils/enum/order";
import { tabStatusState } from "../../store/tab";

const OrderPage = () => {
  const navigate = useNavigate();
  const setLoading = useSetRecoilState(loadingState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const resetOrderState = useSetRecoilState(setOrderDefaultState);
  const { orderTab } = useRecoilValue(tabStatusState);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [items, setItems] = useState([]);
  const [canOrder, setCanOrder] = useState(true);

  const fetchItems = async () => {
    setLoading(true);

    await list(ORDER_CREATE, { page, status: orderTab })
      .then((res) => {
        page === 1
          ? setItems(res.data.orders)
          : setItems((prev) => [...prev, ...res.data.orders]);

        setPage(res.data.current_page);
        setLastPage(res.data.last_page);
      })
      .catch((error) => noticeError(error?.message))
      .then(() => setLoading(false));
  };

  const fetchSetting = async () => {
    await list(ORDER_SETTING)
      .then((res) => {
        const { start_at, end_at } = res.data.order_settings;
        if (start_at && end_at) {
          const currentTime = moment(moment().format("HH:mm:ss"), "HH:mm:ss");
          const startAt = moment(start_at, "HH:mm:ss");
          const endAt = moment(end_at, "HH:mm:ss");

          setCanOrder(currentTime.isBetween(startAt, endAt));
        }
      })
      .catch((error) => noticeError(error?.message));
  };

  useEffect(() => {
    fetchSetting();
    resetOrderState();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [orderTab, page]);

  return (
    <Page
      className="page w-screen h-screen relative"
      hideScrollbar={true}
      style={{ paddingTop: "60px" }}
    >
      <HeaderComponent title="Danh sách đơn hàng" />
      {!canOrder && (
        <Text className="text-red-500 border border-red-500 p-2 font-bold rounded-lg">
          Thông báo: Đã hết thời gian đặt hàng trong ngày
        </Text>
      )}
      <Tab2Component
        items={TAB_ITEMS_ORDER}
        widthContainer="w-full min-w-[750px]"
        widthChild="w-[25%]"
        action={() => setPage(1)}
        isActive={orderTab}
        keyTab="orderTab"
      />
      {canOrder && (
        <Draggable handle="#siu">
          <div className="fixed right-0 bottom-20 text-center">
            <Icon
              icon="zi-plus-circle"
              size={55}
              className="text-green-500 bg-white rounded-full"
              onClick={() => {
                navigate("create");
              }}
            />
          </div>
        </Draggable>
      )}
      {items.length > 0 && (
        <InfiniteScrollComponent
          dataLength={items.length}
          fetchMore={() => setPage((prev) => prev + 1)}
          hasMore={page < lastPage}
        >
          <div className="mt-5">
            {items.map((item, index) => (
              <div
                className="p-3 text-4xl mt-3 bg-white rounded-xl shadow-lg shadow-black-500/50 block"
                key={index}
              >
                <Link to={`${item?.id}`} className="block">
                  <Text className="bg-sky-400 text-white px-2 py-1 rounded-lg inline-block  ml-auto">
                    {item?.status_text}
                  </Text>
                  <TextBaseLineComponent
                    title="Mã đơn hàng"
                    value={item?.code}
                    mt={5}
                  />
                  <TextBaseLineComponent
                    title="Thời gian đặt hàng"
                    value={parseUtcToLocal(item?.order_date)}
                    mt={1}
                  />
                  <TextBaseLineComponent
                    title="Số lượng sản phẩm"
                    value={item?.total_product}
                    mt={1}
                  />
                  <TextBaseLineComponent
                    title="Tổng tiền"
                    value={format_currency(item?.amount)}
                    mt={1}
                  />
                </Link>
              </div>
            ))}
          </div>
        </InfiniteScrollComponent>
      )}
      <EmptyComponent title="danh sách đơn hàng" length={items.length} />
    </Page>
  );
};

export default OrderPage;
