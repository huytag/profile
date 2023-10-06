import React, { useEffect, useState } from "react";
import DeviceSchedulePage from "./items/schedule";
import HomePage from "./home/index";
import { useSetRecoilState } from "recoil";
import {
  isActiveNavigationState,
  showNavigationState,
} from "../store/navigation";
import { list } from "../services/api";
import { NOTIFICATIONS } from "../utils/constApiRoute";
import { noticeErrorState } from "../store/notice";
import { countUnreadNotificationState } from "../store/notification";
import { isStaff, isSupplier } from "../services/hasPermission";

const Home = () => {
  const noticeError = useSetRecoilState(noticeErrorState);
  const setCountNofitication = useSetRecoilState(countUnreadNotificationState);
  const showBottom = useSetRecoilState(showNavigationState);
  const setBottomActive = useSetRecoilState(isActiveNavigationState);
  const [loading, setLoading] = useState(false);

  const getUnReadNoti = async () => {
    await list(NOTIFICATIONS, { is_read: 0 })
      .then((response) => {
        setLoading(false);
        setCountNofitication(response?.data?.total);
      })
      .catch((error) => noticeError(error?.message));
  };

  useEffect(() => {
    showBottom(true);
    setBottomActive("home");

    getUnReadNoti();
  }, []);

  return (
    <>
      {!loading && (
        <>{isSupplier() || isStaff() ? <DeviceSchedulePage /> : <HomePage />}</>
      )}
    </>
  );
};

export default Home;
