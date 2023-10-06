import React, { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Page, Text } from "zmp-ui";
import EmptyComponent from "../../components/empty";
import HeaderComponent from "../../components/header";
import NotificationItemComponent from "../../components/notification";
import { create, list } from "../../services/api";
import { loadingState } from "../../store/loading";
import { isActiveNavigationState } from "../../store/navigation";
import { noticeErrorState, noticeSuccessState } from "../../store/notice";
import { NOTIFICATIONS, READ_ALL } from "../../utils/constApiRoute";
import { countUnreadNotificationState } from "../../store/notification";
import InfiniteScrollComponent from "../../components/infiniteScrollComponent";
import useNavigateCustomize from "../../hook/navigate/useNavigateCustom";
import IconCheckAll from "../../components/icon/CheckAll";

const NotificationPage = () => {
  const [countUnreadNoti, setCountUnreadNoti] = useRecoilState(
    countUnreadNotificationState
  );
  const menuActive = useSetRecoilState(isActiveNavigationState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const setLoading = useSetRecoilState(loadingState);
  const reload = useNavigateCustomize();
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [notifications, setNotifications] = useState([]);

  const getList = async () => {
    setLoading(true);
    await list(NOTIFICATIONS, { page })
      .then((res) => {
        let notificationData;
        page === 1
          ? (notificationData = res.data.notifications)
          : (notificationData = [...notifications, ...res.data.notifications]);
        setNotifications(notificationData);
        setLastPage(res.data.last_page);
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  const readAll = () => {
    create(READ_ALL)
      .then(() => {
        noticeSuccess("Đánh dấu đã đọc tất cả");
        setCountUnreadNoti(0);
        reload();
      })
      .catch((error) => noticeError(error?.message));
  };

  useEffect(() => {
    getList();
  }, [page]);

  return (
    <Page className="page" style={{ paddingTop: "50px" }} hideScrollbar={true}>
      <HeaderComponent title="Thông báo" />

      <div className="bg-white rounded-lg mt-3 overflow-hidden mb-3">
        <div className="flex justify-between items-center border-b p-3">
          <Text.Title>Thông báo ({countUnreadNoti})</Text.Title>
          <Text
            size="small"
            className={`w-[25px] h-[25px] ${
              countUnreadNoti > 0 && "text-cyan-500"
            }`}
            onClick={() => countUnreadNoti > 0 && readAll()}
          >
            <IconCheckAll />
          </Text>
        </div>
      </div>

      {notifications.length > 0 && (
        <InfiniteScrollComponent
          className="bg-white rounded-lg mt-3 overflow-hidden mb-3 p-2 pb-3"
          dataLength={notifications.length}
          fetchMore={() => setPage((prev) => prev + 1)}
          hasMore={page < lastPage}
        >
          {notifications.map((item, index) => (
            <NotificationItemComponent item={item} key={index} />
          ))}
        </InfiniteScrollComponent>
      )}

      <EmptyComponent length={notifications.length} title="Thông báo" />
    </Page>
  );
};

export default NotificationPage;
