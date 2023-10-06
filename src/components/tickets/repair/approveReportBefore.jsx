import React, { useState } from "react";
import { Box, Button } from "zmp-ui";
import { useSetRecoilState } from "recoil";
import { create } from "../../../services/api";
import {
  APPROVE,
  REJECT,
  REPORT_BEFORE,
  TICKETS,
} from "../../../utils/constApiRoute";
import { loadingState } from "../../../store/loading";
import { hasPermission } from "../../../services/hasPermission";
import {
  PER_ASSET_TICKET_APPROVE_REPORT_BEFORE,
  perTicketDefault,
} from "../../../utils/enumPermission";
import { noticeErrorState, noticeSuccessState } from "../../../store/notice";
import ModalCancelComponent from "../../modal/cancel";
import { SUB_WANTING_RECEIPT_REPAIR } from "../../../utils/enumTicket";
import InfoApproveTicketBeforeRepairComponent from "../../info/repair/approveBefore";
import ModalApproveComponent from "../../modal/approve";
import useNavigateCustomize from "../../../hook/navigate/useNavigateCustom";

const ApproveReportBeforeRepairComponent = ({ item }) => {
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const setLoading = useSetRecoilState(loadingState);
  const [popupVisible, setPopupVisible] = useState({
    cancel: false,
    approve: false,
    warranty: false,
  });
  const reloadPage = useNavigateCustomize();

  const onWarranty = (type) => {
    setPopupVisible({ ...popupVisible, warranty: false });
    if (type === "cancel") return;

    setLoading(true);
    create(`${TICKETS}/${item?.id}/liquidation`)
      .then((res) => {
        noticeSuccess("Thanh lý thành công.");
        reloadPage();
      })
      .catch((error) => noticeError(error?.message));
  };

  const onApprove = (type) => {
    if (type === "cancel") {
      setPopupVisible({ ...popupVisible, approve: false });
      return;
    }

    setLoading(true);
    create(`${TICKETS}/${item?.id}/${REPORT_BEFORE}/${APPROVE}`)
      .then((res) => {
        noticeSuccess("Chấp nhận yêu cầu thành công.");
        reloadPage();
      })
      .catch((error) => noticeError(error?.message));
  };

  const cancelRequest = (note) => {
    const data = {
      reason_refuse: note,
    };

    create(`${TICKETS}/${item?.id}/${REPORT_BEFORE}/${REJECT}`, data)
      .then((res) => {
        noticeSuccess("Huỷ yêu cầu thành công.");
        reloadPage();
      })
      .catch((error) => noticeError(error?.message));
  };

  const modalCancelAction = (action, note) => {
    setPopupVisible({ ...popupVisible, cancel: false });
    if (action === "cancel") return;
    setLoading(true);

    cancelRequest(note);
  };

  return (
    <div className="rounded-xl text-4xl mt-2">
      <InfoApproveTicketBeforeRepairComponent item={item} />

      {item?.sub_status === SUB_WANTING_RECEIPT_REPAIR && (
        <>
          <Box
            className={`custom-bottom-sheet mt-2 w-full bg-white rounded-md`}
            flex
            flexDirection="column"
          >
            <div>
              <Box flex flexDirection="row" mt={1}>
                <div
                  className={`flex-1 pr-1 ${hasPermission([
                    ...perTicketDefault,
                    PER_ASSET_TICKET_APPROVE_REPORT_BEFORE,
                  ])}`}
                >
                  <Button
                    fullWidth
                    type="danger"
                    size="large"
                    variant="secondary"
                    onClick={() =>
                      setPopupVisible({ ...popupVisible, cancel: true })
                    }
                  >
                    Từ chối
                  </Button>
                </div>
                <div
                  className={`flex-1 pr-1 ${hasPermission([
                    ...perTicketDefault,
                    PER_ASSET_TICKET_APPROVE_REPORT_BEFORE,
                  ])}`}
                >
                  <Button
                    fullWidth
                    variant="secondary"
                    onClick={() =>
                      setPopupVisible({ ...popupVisible, warranty: true })
                    }
                  >
                    Thanh lý
                  </Button>
                </div>
                <div
                  className={`flex-1 pr-1 ${hasPermission([
                    ...perTicketDefault,
                    PER_ASSET_TICKET_APPROVE_REPORT_BEFORE,
                  ])}`}
                >
                  <Button
                    fullWidth
                    variant="primary"
                    onClick={() =>
                      setPopupVisible({ ...popupVisible, approve: true })
                    }
                  >
                    Duyệt
                  </Button>
                </div>
              </Box>
            </div>
          </Box>

          <ModalCancelComponent
            isVisible={popupVisible.cancel}
            action={modalCancelAction}
          />

          <ModalApproveComponent
            isVisible={popupVisible.approve}
            action={(type) => onApprove(type)}
          />

          <ModalApproveComponent
            isVisible={popupVisible.warranty}
            action={(type) => onWarranty(type)}
            title="Thanh lý yêu cầu này"
          />
        </>
      )}
    </div>
  );
};

export default ApproveReportBeforeRepairComponent;
