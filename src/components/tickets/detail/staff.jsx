import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import { Box, Button, Text, Input, useNavigate } from "zmp-ui";
import { apiClient } from "../../../services/api";
import { hasPermission } from "../../../services/hasPermission";
import { loadingState } from "../../../store/loading";
import { noticeErrorState, noticeSuccessState } from "../../../store/notice";
import { TICKETS } from "../../../utils/constApiRoute";
import {
  ASSET_TICKET_TECHNICAL_RECEIVE,
  perTicketDefault,
} from "../../../utils/enumPermission";
import moment from "moment";
import { empty } from "../../../utils";
import ModalApproveComponent from "../../modal/approve";
import useNavigateCustomize from "../../../hook/navigate/useNavigateCustom";
import { METHOD_PC_REPAIR } from "../../../utils/enumTicket";

const TicketApproveStaffComopnent = ({ item }) => {
  const reloadPage = useNavigateCustomize();
  const navigate = useNavigate();
  const setLoading = useSetRecoilState(loadingState);
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const [popupApproveVisible, setPopupApproveVisible] = useState(false);

  const confirm = (action) => {
    setPopupApproveVisible(false);
    if (action === "cancel") return;

    setLoading(true);
    apiClient
      .post(`${TICKETS}/${item?.id}/technician-receive`)
      .then((response) => {
        noticeSuccess("Lên lịch thành công!");
        reloadPage();
      })
      .catch((error) => {
        noticeError(error?.message);
        setLoading(false);
      });
  };

  return (
    <>
      {!hasPermission([
        ...perTicketDefault,
        ASSET_TICKET_TECHNICAL_RECEIVE,
      ]) && (
        <Box>
          <div className="p-4 text-4xl mt-7 bg-white rounded-xl shadow-lg shadow-black-500/50">
            <Text.Title size="large" className="mb-2">
              Phương Án đã chọn
            </Text.Title>
            <Input
              value={item?.method_type_text}
              className="pointer-events-none bg-gray-200"
            />

            {item && item?.method_type !== METHOD_PC_REPAIR && (
              <>
                <Text.Title size="large" className="mt-5 mb-2">
                  Nhà cung cấp đã chọn
                </Text.Title>
                <Input
                  value={item?.supplier?.name}
                  className="pointer-events-none bg-gray-200"
                />

                <Text.Title size="large" className="mt-5 mb-2">
                  Nhân viên bảo trì
                </Text.Title>
                <Input
                  value={item?.technician?.name}
                  className="pointer-events-none bg-gray-200"
                />
              </>
            )}

            <Text.Title size="large" className="mt-5 mb-2">
              Lịch dự kiến
            </Text.Title>
            <Input
              value={moment(item?.estimate_date).format("DD/MM/YYYY")}
              className="pointer-events-none bg-gray-200"
            />
          </div>
        </Box>
      )}

      <Box
        p={4}
        className={`custom-bottom-sheet fixed bottom-0 left-0 w-full bg-white`}
        flex
        flexDirection="column"
      >
        <div>
          <Box flex flexDirection="row" mt={1}>
            <div
              className={`flex-1 pr-1 ${hasPermission([
                ...perTicketDefault,
                ASSET_TICKET_TECHNICAL_RECEIVE,
              ])}`}
            >
              <Button
                fullWidth
                variant="primary"
                onClick={() => setPopupApproveVisible(true)}
              >
                Tiếp nhận
              </Button>
            </div>
            <div
              className={`flex-1 pr-1 ${
                empty(
                  hasPermission([
                    ...perTicketDefault,
                    ASSET_TICKET_TECHNICAL_RECEIVE,
                  ])
                ) && "hidden"
              }`}
            >
              <Button
                fullWidth
                variant="secondary"
                onClick={() => navigate(-1)}
              >
                Quay lại
              </Button>
            </div>
          </Box>
        </div>
      </Box>

      <ModalApproveComponent
        isVisible={popupApproveVisible}
        action={confirm}
        title="Đồng ý tiếp nhận"
      />
    </>
  );
};

export default TicketApproveStaffComopnent;
