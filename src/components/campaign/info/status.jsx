import React, { useCallback, useState } from "react";
import { Button, Icon, Text } from "zmp-ui";
import { parseUtcToLocal } from "../../../utils";
import ModalApproveComponent from "../../modal/approve";
import * as StatusApp from "../../../utils/enumDisplayApp";
import { apiClient } from "../../../services/api";
import { useSetRecoilState } from "recoil";
import { noticeErrorState, noticeSuccessState } from "../../../store/notice";
import { loadingState } from "../../../store/loading";
import useNavigateCustomize from "../../../hook/navigate/useNavigateCustom";
import { canViewReport } from "../../../services/hasPermission";
import { IconProgress } from "../../icon";
import IconCalendarCheck from "../../icon/CalendarCheck";
import IconCalendar from "../../icon/CalendarWaiting";
import IconPayComplete from "../../icon/PayComplete";
import IconPayFailed from "../../icon/PayFailed";

const CampaignStatusComponent = ({
  item,
  title = "Trạng thái",
  mt = 3,
  urlComfirm,
}) => {
  const reloadPage = useNavigateCustomize();
  const setLoading = useSetRecoilState(loadingState);
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const [isVisible, setIsvisible] = useState(false);

  const iconStatus = (status = null) => {
    switch (status) {
      case StatusApp.WAITING_FOR_APPROVAL:
      case StatusApp.WAITING_FOR_REVIEW_AND_PAYMENT:
        return <IconCalendar className="w-12" />;
      case StatusApp.JOINING:
        return <IconCalendarCheck className="w-12" />;
      case StatusApp.REFUSE_TO_PARTICIPATE:
        return <IconCalendar className="w-12" color="red" />;
      case StatusApp.PAYING_IN_PROGRESS:
        return <IconProgress className="w-12" />;
      case StatusApp.PAID_REWARD:
        return <IconPayComplete className="w-12" />;
      case StatusApp.NO_REWARD:
        return <IconPayFailed className="w-12" />;
      default:
        return <Icon icon="zi-ban" size={60} className="text-red-500" />;
    }
  };

  const modelAction = useCallback((type) => {
    setIsvisible(false);
    if (type === "cancel") return;

    setLoading(true);
    apiClient
      .put(urlComfirm)
      .then(() => {
        noticeSuccess("Xác nhận thành công");
        reloadPage();
      })
      .catch((error) => {
        noticeError(error?.message);
        setLoading(false);
      });
  });

  return (
    <>
      <div className={`bg-white p-4 rounded-lg shadow-lg mt-${mt}`}>
        <Text.Title
          size="xLarge"
          className="border-b-2 pb-2 border-dashed border-[#dddddd]"
        >
          {title}
        </Text.Title>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <Text size="large" className="text-[#2b78e4] font-bold">
              {item?.status_text ?? "Chưa tham gia"}
            </Text>
            <Text size="small" className="mt-1">
              {item?.last_activity_at &&
                parseUtcToLocal(item?.last_activity_at)}
            </Text>
            {item?.reason_no_reward && (
              <Text size="small" className="mt-1">
                Lý do:{" "}
                <span className="text-gray-400">{item?.reason_no_reward}</span>
              </Text>
            )}
          </div>
          <div>
            {iconStatus(item?.status)}

            {/* <FontAwesomeIcon icon={iconStatus(item?.status)} size="3x" /> */}
          </div>
        </div>

        {item?.status === StatusApp.PAYING_IN_PROGRESS && !canViewReport() && (
          <Button
            fullWidth
            className="mt-5"
            size="medium"
            onClick={() => setIsvisible(true)}
          >
            Xác nhận trả thưởng
          </Button>
        )}
      </div>

      <ModalApproveComponent
        isVisible={isVisible}
        action={modelAction}
        title="Xác nhận đã trả thưởng"
        description="Nhân viên bán hàng đã trả thưởng tới bạn?"
      />
    </>
  );
};

export default CampaignStatusComponent;
