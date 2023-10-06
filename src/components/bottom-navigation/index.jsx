import React from "react";
import { Link } from "react-router-dom";
import { Icon, Text } from "zmp-ui";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  isActiveNavigationState,
  showNavigationState,
} from "../../store/navigation";
import {
  isDistributor,
  isOutlet,
  isPCer,
  isPG,
  isSaleman,
  isStaff,
  isSupervisor,
} from "../../services/hasPermission";
import { IconDevice, IconSquares, IconSurvey, IconWreanch } from "../icon";

const BottomNavigationPage = () => {
  const isShow = useRecoilValue(showNavigationState);
  const [activeTab, setActiveTab] = useRecoilState(isActiveNavigationState);
  const showBottomMenu = useSetRecoilState(showNavigationState);

  return (
    <>
      <div
        className={`
          bottom-navigation h-[55px] bg-white fixed bottom-0 z-20
          left-0 w-full border-t-2 grid grid-flow-col grid-col-5 gap-1 auto-cols-fr py-1 px-2
          ${!isShow ? "hidden" : ""}
        `}
      >
        <Link
          to="/home"
          className={`item text-center text-lg group hover:text-blue-600 ${
            activeTab === "home" ? "text-blue-600" : ""
          }`}
          onClick={() => setActiveTab("home")}
        >
          <Icon icon="zi-home" size={24} />
          <Text size="xxSmall" className="whitespace-nowrap truncate">
            Trang chủ
          </Text>
        </Link>

        {!isStaff() &&
          (isDistributor() ? (
            <Link
              to="/survey"
              className={`item text-center text-lg group hover:text-blue-600 
            ${activeTab === "survey" ? "text-blue-600" : ""}  
            `}
              onClick={() => setActiveTab("survey")}
            >
              <IconSurvey className="mx-auto my-[2px] w-6" />
              <Text size="xxSmall" className="whitespace-nowrap truncate">
                Khảo sát
              </Text>
            </Link>
          ) : (
            <Link
              to="/devices"
              className={`item text-center text-lg group hover:text-blue-600 ${
                activeTab === "devices" ? "text-blue-600" : ""
              } ${isPG() ? "hidden" : ""}
            `}
              onClick={() => setActiveTab("devices")}
            >
              <IconDevice className="mx-auto my-[2px] w-6" />
              <Text size="xxSmall" className="whitespace-nowrap truncate">
                Thiết bị
              </Text>
            </Link>
          ))}

        {(isOutlet() ||
          isPCer() ||
          isSaleman() ||
          isStaff() ||
          isSupervisor()) && (
          <Link
            to="/qr"
            className={`item text-center text-lg group hover:text-blue-600 ${
              activeTab === "qr" ? "text-blue-600" : ""
            }`}
          >
            <div
              className="absolute text-3xl left-1/2 border p-1.5 rounded-full w-[50px] h-[50px] bg-[#ccc] flex items-center justify-center"
              style={{ transform: "translate(-50%, -50%)" }}
            >
              <Icon icon="zi-qrline" size={38} />
            </div>
            <Icon icon="zi-qrline" size={24} className="opacity-0" />
            <Text size="xxSmall" className="whitespace-nowrap truncate">
              Quét QR
            </Text>
          </Link>
        )}

        {!isStaff() &&
          (isOutlet() ||
          isPG() ||
          isDistributor() ||
          isSaleman() ||
          isSupervisor() ? (
            <Link
              to={`${isPG() ? "/campaigns/sampling" : "/campaigns"}`}
              className={`item text-center text-lg group hover:text-blue-600 ${
                activeTab === "campaigns" ? "text-blue-600" : ""
              }`}
              onClick={() => {
                setActiveTab("campaigns");
                showBottomMenu(true);
              }}
            >
              <IconSquares className="mx-auto my-[2px] w-6" />
              <Text size="xxSmall" className="whitespace-nowrap truncate">
                Chương trình
              </Text>
            </Link>
          ) : (
            <Link
              to="/maintenance"
              className={`item text-center text-lg group hover:text-blue-600 ${
                activeTab === "maintenance" ? "text-blue-600" : ""
              }`}
              onClick={() => {
                setActiveTab("maintenance");
                showBottomMenu(true);
              }}
            >
              <IconWreanch className="mx-auto my-[2px] w-6" />
              <Text size="xxSmall" className="whitespace-nowrap truncate">
                Bảo trì
              </Text>
            </Link>
          ))}

        <Link
          to="/me"
          className={`item text-center text-lg group hover:text-blue-600 ${
            activeTab === "me" ? "text-blue-600" : ""
          }`}
          onClick={() => setActiveTab("me")}
        >
          <Icon icon="zi-user-circle" size={24} />
          <Text size="xxSmall" className="whitespace-nowrap truncate">
            Thông tin
          </Text>
        </Link>
      </div>
    </>
  );
};

export default BottomNavigationPage;
