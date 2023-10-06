import React, { useEffect, useState } from "react";
import { Box, Button } from "zmp-ui";
import { useSetRecoilState } from "recoil";
import { create } from "../../../services/api";
import { loadingState } from "../../../store/loading";
import { hasPermission, isPCer } from "../../../services/hasPermission";
import {
  perTicketDefault,
  PER_ASSET_TICKET_APPROVE_REPORT_AFTER,
} from "../../../utils/enumPermission";
import { noticeErrorState, noticeSuccessState } from "../../../store/notice";
import InfoApproveTicketAfterRepairComponent from "../../info/repair/approveAfter";
import ModalCancelComponent from "../../modal/cancel";
import {
  APPROVE,
  REJECT,
  REPORT_AFTER,
  TICKETS,
} from "../../../utils/constApiRoute";
import ModalApproveComponent from "../../modal/approve";
import AccordionComponent from "../../accordion";
import InfoApproveTicketBeforeRepairComponent from "../../info/repair/approveBefore";
import useNavigateCustomize from "../../../hook/navigate/useNavigateCustom";

const ApproveReportAfterRepairComponent = ({ item }) => {
  const reloadPage = useNavigateCustomize();
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const setLoading = useSetRecoilState(loadingState);
  const [listAcc, setListAcc] = useState([]);
  const [isShowPopup, setIsShowPopup] = useState({
    cancel: false,
    approve: false,
  });
  const isPc = isPCer();

  const onApproved = (type) => {
    setIsShowPopup({ ...isShowPopup, approve: false });
    if (type === "cancel") {
      return;
    }

    setLoading(true);
    createApproved();
  };

  const createApproved = async () => {
    create(`${TICKETS}/${item?.id}/${REPORT_AFTER}/${APPROVE}`)
      .then((res) => {
        noticeSuccess("Chấp nhận yêu cầu thành công.");
        reloadPage();
      })
      .catch((error) => {
        noticeError(error?.message);
        setLoading(false);
      });
  };

  const actionCancel = (action, note) => {
    setIsShowPopup({ ...isShowPopup, cancel: false });
    if (action === "cancel") return;
    setLoading(true);

    cancelRequest(note);
  };

  const cancelRequest = (note) => {
    const data = {
      reason_refuse: note,
    };

    create(`${TICKETS}/${item?.id}/${REPORT_AFTER}/${REJECT}`, data)
      .then((res) => {
        noticeSuccess("Huỷ yêu cầu thành công.");
        reloadPage();
      })
      .catch((error) => {
        noticeError(error?.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    setListAcc([
      {
        title: "Báo cáo trước sửa chữa",
        component: <InfoApproveTicketBeforeRepairComponent item={item} />,
        key: "info-after-repair",
        bg: true,
      },
      {
        title: "Báo cáo sau sửa chữa",
        component: <InfoApproveTicketAfterRepairComponent item={item} />,
        key: "info-before-repair",
        bg: true,
      },
    ]);
  }, []);

  return (
    <>
      <AccordionComponent list={listAcc} indexActive={1} />
      {isPc && (
        <>
          <Box
            className={"custom-bottom-sheet mt-5 w-full"}
            flex
            flexDirection="column"
          >
            <div>
              <Box flex flexDirection="row" mt={1}>
                <div
                  className={`flex-1 pr-1 ${hasPermission([
                    ...perTicketDefault,
                    PER_ASSET_TICKET_APPROVE_REPORT_AFTER,
                  ])}`}
                >
                  <Button
                    fullWidth
                    type="danger"
                    size="large"
                    variant="secondary"
                    onClick={() =>
                      setIsShowPopup({ ...isShowPopup, cancel: true })
                    }
                  >
                    Từ chối
                  </Button>
                </div>
                <div
                  className={`flex-1 pr-1 ${hasPermission([
                    ...perTicketDefault,
                    PER_ASSET_TICKET_APPROVE_REPORT_AFTER,
                  ])}`}
                >
                  <Button
                    fullWidth
                    variant="primary"
                    onClick={() =>
                      setIsShowPopup({ ...isShowPopup, approve: true })
                    }
                  >
                    Duyệt
                  </Button>
                </div>
              </Box>
            </div>
          </Box>
          <ModalCancelComponent
            isVisible={isShowPopup.cancel}
            action={actionCancel}
          />
          <ModalApproveComponent
            isVisible={isShowPopup.approve}
            action={(type) => onApproved(type)}
          />
        </>
      )}
    </>
  );
};

export default ApproveReportAfterRepairComponent;
