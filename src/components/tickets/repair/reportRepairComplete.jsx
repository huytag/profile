import React, { useCallback, useState } from "react";
import { Box, Button } from "zmp-ui";
import AccordionComponent from "../../accordion";
import InfoApproveTicketBeforeRepairComponent from "../../info/repair/approveBefore";
import {
  ASSET_TICKET_SUPERVISION_COMPLETE,
  perTicketDefault,
  PER_ASSET_TICKET_CONFIRM_COMPLETE,
} from "../../../utils/enumPermission";
import { hasPermission, isOutlet } from "../../../services/hasPermission";
import { useSetRecoilState } from "recoil";
import { noticeErrorState, noticeSuccessState } from "../../../store/notice";
import { create } from "../../../services/api";
import { TICKETS } from "../../../utils/constApiRoute";
import { loadingState } from "../../../store/loading";
import ModalConfirmComponent from "../../modal/confirm";
import InfoApproveTicketAfterRepairComponent from "../../info/repair/approveAfter";
import { SUB_OUTLET_COMPLETE, SUB_PROCESSED } from "../../../utils/enumTicket";
import ModalApproveComponent from "../../modal/approve";
import useNavigateCustomize from "../../../hook/navigate/useNavigateCustom";

const ReportRepairCompleteComponent = ({ item }) => {
  const noticeError = useSetRecoilState(noticeErrorState);
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const setLoading = useSetRecoilState(loadingState);
  const reloadPage = useNavigateCustomize();
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupVisibleGS, setPopupVisibleGs] = useState(false);
  const listAcc = [
    {
      title: "Báo cáo trước sửa chữa",
      component: <InfoApproveTicketBeforeRepairComponent item={item} />,
      key: "info-before-repair",
      bg: true,
    },
    {
      title: "Báo cáo sau sửa chữa",
      component: <InfoApproveTicketAfterRepairComponent item={item} />,
      key: "info-after-repair",
      bg: true,
    },
  ];

  const modelOutletAction = useCallback((type, rate) => {
    setPopupVisible(false);
    if (type === "cancel") return;

    setLoading(true);

    create(`${TICKETS}/${item?.id}/complete`, {
      supplier_rate: rate,
    })
      .then((res) => {
        noticeSuccess("Xác nhận thành công!");
        reloadPage();
      })
      .catch((error) => {
        noticeError(error?.message);
        setLoading(false);
      });
  });

  const modelGsAction = useCallback((type) => {
    setPopupVisibleGs(false);
    if (type === "cancel") return;

    setLoading(true);

    create(`${TICKETS}/${item?.id}/complete-supervision`)
      .then((res) => {
        noticeSuccess("Xác nhận thành công!");
        reloadPage();
      })
      .catch((error) => {
        noticeError(error?.message);
        setLoading(false);
      });
  });

  return (
    <>
      <AccordionComponent list={listAcc} indexActive={1} />

      {isOutlet() &&
      item?.sub_status === SUB_PROCESSED &&
      !hasPermission([
        ...perTicketDefault,
        PER_ASSET_TICKET_CONFIRM_COMPLETE,
      ]) ? (
        <>
          <Box flex flexDirection="row" mt={5}>
            <div className={`flex-1 pl-1`}>
              <Button fullWidth onClick={() => setPopupVisible(true)}>
                Xác nhận hoàn thành
              </Button>
            </div>
          </Box>

          <ModalConfirmComponent
            isVisible={popupVisible}
            action={modelOutletAction}
          />
        </>
      ) : (
        ""
      )}

      {!hasPermission([
        ...perTicketDefault,
        ASSET_TICKET_SUPERVISION_COMPLETE,
      ]) && item?.sub_status === SUB_OUTLET_COMPLETE ? (
        <>
          <Box flex flexDirection="row" mt={5}>
            <div className={`flex-1 pl-1`}>
              <Button fullWidth onClick={() => setPopupVisibleGs(true)}>
                Xác nhận hoàn thành
              </Button>
            </div>
          </Box>

          <ModalApproveComponent
            isVisible={popupVisibleGS}
            action={modelGsAction}
            title="Xác nhận hoàn thành"
          />
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default ReportRepairCompleteComponent;
