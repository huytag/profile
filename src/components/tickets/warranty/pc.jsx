import React, { useState, useEffect } from "react";
import { Box, Button } from "zmp-ui";
import { apiClient } from "../../../services/api";
import { TICKETS } from "../../../utils/constApiRoute";
import AccordionComponent from "../../accordion";
import InfoReportWarrantyComopnent from "../../info/warranty/reportMedia";
import ModalCancel from "../../modal/cancel";
import ModalApprove from "../../modal/approve";
import { useSetRecoilState } from "recoil";
import { noticeErrorState, noticeSuccessState } from "../../../store/notice";
import { loadingState } from "../../../store/loading";
import { hasPermission } from "../../../services/hasPermission";
import {
  perTicketDefault,
  PER_ASSET_TICKET_APPROVE_REPORT_AFTER,
} from "../../../utils/enumPermission";
import useNavigateCustomize from "../../../hook/navigate/useNavigateCustom";

const TicketWarrantyPcComopnent = ({ item }) => {
  const reloadPage = useNavigateCustomize();
  const setLoading = useSetRecoilState(loadingState);
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupApproveVisible, setPopupApproveVisible] = useState(false);
  const [listAcc, setListAcc] = useState([]);

  const cancelAction = (action, note) => {
    setPopupVisible(false);
    if (action === "cancel") return;

    setLoading(true);
    apiClient
      .post(`${TICKETS}/${item?.id}/refuse-report-after`, {
        reason_refuse: note,
      })
      .then((res) => {
        noticeSuccess("Từ chối thành công!");
        reloadPage();
      })
      .catch((error) => {
        noticeError(error?.message);
        setLoading(false);
      });
  };

  const confirm = (action) => {
    setPopupApproveVisible(false);
    if (action === "cancel") return;

    setLoading(true);
    apiClient
      .post(`${TICKETS}/${item?.id}/approval-report-after`)
      .then((res) => {
        noticeSuccess("Duyệt thành công!");
        reloadPage();
      })
      .catch((error) => {
        noticeError(error?.message);
        setLoading(false);
      });
  };

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

      {item?.can_report_after_approve && (
        <>
          <Box
            flex
            flexDirection="row"
            mt={5}
            className={`${hasPermission([
              ...perTicketDefault,
              PER_ASSET_TICKET_APPROVE_REPORT_AFTER,
            ])}`}
          >
            <div className={`flex-1 pr-1 `}>
              <Button
                fullWidth
                type="danger"
                variant="secondary"
                onClick={() => setPopupVisible(true)}
              >
                Từ chối
              </Button>
            </div>
            <div className={`flex-1 pl-1`}>
              <Button fullWidth onClick={() => setPopupApproveVisible(true)}>
                Duyệt
              </Button>
            </div>
          </Box>

          <ModalCancel isVisible={popupVisible} action={cancelAction} />
          <ModalApprove isVisible={popupApproveVisible} action={confirm} />
        </>
      )}
    </>
  );
};

export default TicketWarrantyPcComopnent;
