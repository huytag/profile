import React from "react";
import { Link } from "react-router-dom";
import { Box, Icon, Page, Swiper, Text } from "zmp-ui";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isActiveNavigationState } from "../../store/navigation";
import logo from "../../static/logo-notice.jpg";
import { countUnreadNotificationState } from "../../store/notification";
import {
  isDistributor,
  isOutlet,
  isPCer,
  isPG,
  isSaleman,
  isSupervisor,
} from "../../services/hasPermission";
import {
  IconStore,
  IconSurvey,
  IconWreanchColor,
  IconSupport,
} from "../../components/icon";

const HomePage = () => {
  const countUnreadNotification = useRecoilValue(countUnreadNotificationState);
  const setActiveTab = useSetRecoilState(isActiveNavigationState);

  return (
    <Page
      className="bg-white page"
      style={{ paddingTop: "50px" }}
      hideScrollbar={true}
    >
      <div
        className="zaui-header"
        style={{
          textAlign: "center",
          backgroundColor: "#013772",
          color: "#fff",
        }}
      >
        <span className="zaui-header-title">TH</span>
      </div>

      <div className="flex justify-between items-center py-4">
        <div className="flex items-center">
          <img src={logo} alt="TH" className="w-[17vw]" />
          <div className="ml-2">
            <Text.Title size="large">THFC</Text.Title>
            <Text.Title size="small" className="text-sm	">
              Thương hiệu sữa hàng đầu Việt Nam
            </Text.Title>
          </div>
        </div>
        <div className="relative">
          {!!countUnreadNotification && (
            <span className="absolute -top-4 -right-1 bg-blue-600 z-10 text-white rounded-full text-xs p-0.5 pointer-events-none w-[20px] h-[20px] text-center flex items-center justify-center translate-y-1/3">
              {countUnreadNotification}
            </span>
          )}

          <Link to="/notification" onClick={() => setActiveTab("notice")}>
            <Icon size={32} icon="zi-notif" className="text-blue-500" />
          </Link>
        </div>
      </div>
      <div className="banner">
        <Swiper autoplay duration={5000} loop>
          <Swiper.Slide>
            <img
              className="slide-img"
              src="https://stc-zmp.zadn.vn/zmp-zaui/images/0e05d63a7a93a6cdff826.jpg"
              alt="slide-1"
            />
          </Swiper.Slide>
          <Swiper.Slide>
            <img
              className="slide-img"
              src="https://stc-zmp.zadn.vn/zmp-zaui/images/0f7c061caab576eb2fa45.jpg"
              alt="slide-2"
            />
          </Swiper.Slide>
          <Swiper.Slide>
            <img
              className="slide-img"
              src="https://stc-zmp.zadn.vn/zmp-zaui/images/321fb45f18f6c4a89de78.jpg"
              alt="slide-3"
            />
          </Swiper.Slide>
          <Swiper.Slide>
            <img
              className="slide-img"
              src="https://stc-zmp.zadn.vn/zmp-zaui/images/4f417921d58809d650997.jpg"
              alt="slide-4"
            />
          </Swiper.Slide>
          <Swiper.Slide>
            <img
              className="slide-img"
              src="https://stc-zmp.zadn.vn/zmp-zaui/images/677fad2e0187ddd984969.jpg"
              alt="slide-5"
            />
          </Swiper.Slide>
        </Swiper>
      </div>

      <div
        className={`mt-3 bg-[#fff] shadow-md hover:shadow-xl transition-all rounded-md four-icon flex items-center justify-evenly text-center ${
          isDistributor() || isPG() ? "hidden" : ""
        }`}
      >
        {isOutlet() && (
          <Link
            to="/order"
            className={`text-center p-2`}
            onClick={() => setActiveTab("story")}
          >
            <Box className="bg-[#e9e9e9] p-2 rounded-full">
              <IconStore className="mx-auto w-9" />
            </Box>
            <Text size="xxSmall" className="mt-1 whitespace-nowrap truncate">
              Đặt hàng
            </Text>
          </Link>
        )}

        {(!isPCer() || !isSaleman()) && (
          <Link
            to="/survey"
            className={`text-center p-2`}
            onClick={() => setActiveTab("home")}
          >
            <Box className="bg-[#e9e9e9] p-2 rounded-full">
              <IconSurvey className="mx-auto w-9" />
            </Box>
            <Text size="xxSmall" className="mt-1 whitespace-nowrap truncate">
              Khảo sát
            </Text>
          </Link>
        )}

        {(isOutlet() || isSaleman() || isSupervisor()) && (
          <Link
            to="/maintenance"
            className={`text-center p-2`}
            onClick={() => setActiveTab("maintenance")}
          >
            <Box className="bg-[#e9e9e9] p-2 rounded-full">
              <IconWreanchColor className="mx-auto w-9" />
            </Box>
            <Text size="xxSmall" className="mt-1 whitespace-nowrap truncate">
              Bảo trì
            </Text>
          </Link>
        )}

        {isOutlet() && (
          <Link
            to="/help-center"
            className={`text-center p-2`}
            onClick={() => setActiveTab("qa")}
          >
            <Box className="bg-[#e9e9e9] p-2 rounded-full">
              <IconSupport className="mx-auto w-9" />
            </Box>
            <Text size="xxSmall" className="mt-1 whitespace-nowrap truncate">
              Hỗ trợ
            </Text>
          </Link>
        )}
      </div>
    </Page>
  );
};

export default HomePage;
