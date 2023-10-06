import React, { useState, useEffect, useCallback } from "react";
import { Box, Button } from "zmp-ui";
import { create } from "../../../services/api";
import { TICKETS } from "../../../utils/constApiRoute";
import AccordionComponent from "../../accordion";
import InfoReportWarrantyComopnent from "../../info/warranty/reportMedia";
import { useSetRecoilState } from "recoil";
import { noticeErrorState, noticeSuccessState } from "../../../store/notice";
import { loadingState } from "../../../store/loading";
import { hasPermission, isOutlet } from "../../../services/hasPermission";
import {
  ASSET_TICKET_SUPERVISION_COMPLETE,
  perTicketDefault,
  PER_ASSET_TICKET_CONFIRM_COMPLETE,
} from "../../../utils/enumPermission";
import ModalConfirmComponent from "../../modal/confirm";
import { SUB_OUTLET_COMPLETE, SUB_PROCESSED } from "../../../utils/enumTicket";
import ModalApproveComponent from "../../modal/approve";
import useNavigateCustomize from "../../../hook/navigate/useNavigateCustom";

const TicketWarrantyOutletConfirmComopnent = ({ item }) => {
  const reloadPage = useNavigateCustomize();
  const setLoading = useSetRecoilState(loadingState);
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupVisibleGS, setPopupVisibleGS] = useState(false);
  const [listAcc, setListAcc] = useState([]);

  const modelAction = useCallback((type, rate) => {
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
    setPopupVisibleGS(false);
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

  useEffect(() => {
    const arrAccordion = item?.report_before_content
      ? [
          {
            title: "Báo lỗi vận hành",
            component: (
              <InfoReportWarrantyComopnent
                images={item?.report_before_images}
                videos={item?.report_before_videos}
                content={item?.report_before_content}
              />
            ),
            key: "info1",
            bg: true,
          },
          {
            title: "Báo cáo sau sửa chữa",
            component: (
              <InfoReportWarrantyComopnent
                images={item?.report_after_images}
                videos={item?.report_after_videos}
                content={item?.report_after_content}
              />
            ),
            key: "info2",
            bg: true,
          },
        ]
      : [
          {
            title: "Báo cáo sau bảo hành",
            component: (
              <InfoReportWarrantyComopnent
                images={item?.report_after_images}
                videos={item?.report_after_videos}
                content={item?.report_after_content}
              />
            ),
            key: "info1",
            bg: true,
          },
        ];

    setListAcc(arrAccordion);
  }, []);

  return (
    <>
      {!!listAcc ? <AccordionComponent list={listAcc} /> : ""}

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
            action={modelAction}
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
              <Button fullWidth onClick={() => setPopupVisibleGS(true)}>
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

export default TicketWarrantyOutletConfirmComopnent;
