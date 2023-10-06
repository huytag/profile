import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Box, Button, useNavigate } from "zmp-ui";
import useNavigateCustomize from "../../../hook/navigate/useNavigateCustom";
import { apiClient } from "../../../services/api";
import { hasPermission } from "../../../services/hasPermission";
import { loadingState } from "../../../store/loading";
import { hiddenBottomSheetState } from "../../../store/navigation";
import { noticeErrorState, noticeSuccessState } from "../../../store/notice";
import ModalApproveComponent from "../../modal/approve";
import ModalCancelComponent from "../../modal/cancel";

const SheetBottomNavigateComponent = ({
  id,
  isCancel = false,
  isHiddenCancel = false,
  isValidate = false,
  isValidateOke = false,
  cancelDisable = false,
  confirmDisable = false,
  actionValidate,
  titleCancel = "Huỷ yêu cầu",
  titleConfirm = "Xác nhận",
  urlCancel,
  urlConfirm,
  permissionsCancel,
  permissionsConfirm,
  dataConfirm,
}) => {
  const navigate = useNavigate();
  const isHidden = useRecoilValue(hiddenBottomSheetState);
  const reloadPage = useNavigateCustomize();
  const setLoading = useSetRecoilState(loadingState);
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupApproveVisible, setPopupApproveVisible] = useState(false);

  const cancel = (action, note) => {
    setPopupVisible(false);
    if (action === "cancel") return;

    setLoading(true);
    apiClient
      .post(urlCancel, {
        id: id,
        reason_cancel: note,
        reason_refuse: note,
      })
      .then((response) => {
        noticeSuccess();
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

    if (isValidate && !isValidateOke) {
      return actionValidate();
    }

    apiConfirm();
  };

  const apiConfirm = () => {
    setLoading(true);
    apiClient
      .post(urlConfirm, {
        ...dataConfirm,
        id: id,
      })
      .then((response) => {
        noticeSuccess();
        reloadPage();
      })
      .catch((error) => {
        noticeError(error?.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (isValidate && isValidateOke) {
      apiConfirm();
    }
  }, [isValidateOke]);

  return (
    <>
      <Box
        p={4}
        className={`custom-bottom-sheet fixed bottom-0 left-0 w-full bg-white ${
          isHidden ? "hidden" : ""
        }`}
        flex
        flexDirection="column"
      >
        {isCancel ? (
          <div>
            <Box flex flexDirection="row" mt={1}>
              <Box style={{ flex: 1 }} pr={1}>
                <Button
                  fullWidth
                  variant="secondary"
                  onClick={() => navigate(-1)}
                >
                  Quay lại
                </Button>
              </Box>
            </Box>
          </div>
        ) : (
          <div>
            <Box flex flexDirection="row" mt={1}>
              <div
                className={`flex-1 pr-1 ${
                  isHiddenCancel ? "hidden" : ""
                } ${hasPermission(permissionsCancel)}`}
              >
                <Button
                  fullWidth
                  type="danger"
                  variant="secondary"
                  onClick={() => setPopupVisible(true)}
                  disabled={cancelDisable}
                >
                  {titleCancel}
                </Button>
              </div>
              <div
                className={`flex-1 pl-1 ${hasPermission(permissionsConfirm)}`}
              >
                <Button
                  fullWidth
                  onClick={() => setPopupApproveVisible(true)}
                  disabled={confirmDisable}
                >
                  {titleConfirm}
                </Button>
              </div>
              {hasPermission(permissionsCancel) &&
              hasPermission(permissionsConfirm) ? (
                <div className={`flex-1 pl-1`}>
                  <Button
                    fullWidth
                    variant="secondary"
                    onClick={() => navigate(-1)}
                  >
                    Quay lại
                  </Button>
                </div>
              ) : (
                ""
              )}
            </Box>
          </div>
        )}
      </Box>

      <ModalCancelComponent isVisible={popupVisible} action={cancel} />
      <ModalApproveComponent isVisible={popupApproveVisible} action={confirm} />
    </>
  );
};

export default SheetBottomNavigateComponent;
