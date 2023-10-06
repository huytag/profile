import React, { useCallback, useState } from "react";
import { Box, Button } from "zmp-ui";
import {
  perTicketDefault,
  PER_ASSET_TICKET_FEE_CONFIRM,
  PER_ASSET_TICKET_FEE_UPDATE,
} from "../../../utils/enumPermission";
import { hasPermission } from "../../../services/hasPermission";
import { useSetRecoilState } from "recoil";
import { noticeErrorState, noticeSuccessState } from "../../../store/notice";
import ModalCancelComponent from "../../modal/cancel";
import { loadingState } from "../../../store/loading";
import { TICKET_FEES } from "../../../utils/constApiRoute";
import { create } from "../../../services/api";
import DistanceComponent from "../../distance";
import InfoFeeComponent from "../../info/fee";
import InfoFeeCategoryItem from "../../info/fee/categoryItem";
import InfoFeeMove from "../../info/fee/move";
import ModalApproveComponent from "../../modal/approve";
import InfoFeeCategory from "../../info/fee/category";
import InfoDescriptionComponent from "../../info/description";
import { STATUS_UPDATE_FEE } from "../../../utils/enumTicketFee";
import useNavigateCustomize from "../../../hook/navigate/useNavigateCustom";

const ApproveFeeComponent = ({ item, ticketFee }) => {
  const noticeError = useSetRecoilState(noticeErrorState);
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const setLoading = useSetRecoilState(loadingState);
  const reloadPage = useNavigateCustomize();
  const [showPopup, setShowPopup] = useState({
    cancel: false,
    approve: false,
  });

  const actionCancel = useCallback((action, note) => {
    setShowPopup({ ...showPopup, cancel: false });
    if (action === "cancel") return;
    setLoading(true);

    cancelRequestFee(note);
  });

  const cancelRequestFee = (note) => {
    setShowPopup({ ...showPopup, cancel: false });

    create(`${TICKET_FEES}/${ticketFee?.id}/deny`, {
      reason_refuse: note,
    })
      .then((res) => {
        noticeSuccess("Từ chối cập nhật chi phí thành công.");
        reloadPage();
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  const onApproveUpdateFee = useCallback(async (type, value) => {
    setShowPopup({ ...showPopup, approve: false });
    if (type === "cancel") {
      return;
    }

    setLoading(true);
    await create(`${TICKET_FEES}/${ticketFee?.id}/confirm`, value)
      .then((res) => {
        noticeSuccess("Duyệt chi phí thành công.");
        reloadPage();
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  });

  return (
    <>
      <Box className="bg-white p-4 rounded-lg mt-3 shadow-lg shadow-black-500/50">
        <InfoFeeCategory ticketFee={ticketFee} />

        <Box mt={5}>
          <InfoFeeCategoryItem item={ticketFee?.repair_ticket_fee_details} />
        </Box>

        {!hasPermission([
          ...perTicketDefault,
          PER_ASSET_TICKET_FEE_CONFIRM,
          PER_ASSET_TICKET_FEE_UPDATE,
        ]) && (
          <Box>
            <Box mt={5}>
              <InfoFeeMove item={ticketFee?.move_ticket_fee_details} />
            </Box>
            <Box my={5}>
              <DistanceComponent
                supplier={item?.supplier}
                outlet={item?.outlet}
                distance1={ticketFee?.distance_1}
                distance2={ticketFee?.distance_2}
              />

              <InfoFeeComponent item={ticketFee} />
            </Box>
            <InfoDescriptionComponent
              title="Mô tả công việc"
              text={ticketFee?.note}
            />

            {ticketFee?.status === STATUS_UPDATE_FEE && (
              <>
                <Box
                  className={`custom-bottom-sheet mt-2 w-full bg-white rounded-md ${hasPermission(
                    [...perTicketDefault, PER_ASSET_TICKET_FEE_CONFIRM]
                  )}`}
                  flex
                  flexDirection="column"
                >
                  <Box flex flexDirection="row" mt={1}>
                    <div className={`flex-1 pr-1 `}>
                      <Button
                        fullWidth
                        type="danger"
                        size="large"
                        variant="secondary"
                        onClick={() =>
                          setShowPopup({ ...showPopup, cancel: true })
                        }
                      >
                        Từ chối
                      </Button>
                    </div>
                    <div className={`flex-1 pr-1`}>
                      <Button
                        fullWidth
                        variant="primary"
                        onClick={() =>
                          setShowPopup({ ...showPopup, approve: true })
                        }
                      >
                        Xác nhận chi phí
                      </Button>
                    </div>
                  </Box>
                </Box>

                <ModalCancelComponent
                  isVisible={showPopup.cancel}
                  action={actionCancel}
                />
                <ModalApproveComponent
                  isVisible={showPopup.approve}
                  action={(type) => onApproveUpdateFee(type)}
                  title="Đồng ý xác nhận chi phí"
                />
              </>
            )}
          </Box>
        )}
      </Box>
    </>
  );
};

export default ApproveFeeComponent;
