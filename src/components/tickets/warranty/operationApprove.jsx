import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import { Button, Text } from "zmp-ui";
import useNavigateCustomize from "../../../hook/navigate/useNavigateCustom";
import { create } from "../../../services/api";
import { hasPermission } from "../../../services/hasPermission";
import { loadingState } from "../../../store/loading";
import { noticeErrorState, noticeSuccessState } from "../../../store/notice";
import {
  APPROVE,
  REJECT,
  REPORT_ERROR,
  TICKETS,
} from "../../../utils/constApiRoute";
import {
  perTicketDefault,
  PER_ASSET_TICKET_REPORT_ERROR,
} from "../../../utils/enumPermission";
import InfoDescriptionComponent from "../../info/description";
import InfoMediaComponent from "../../info/media";
import ModalApproveComponent from "../../modal/approve";
import ModalCancelComponent from "../../modal/cancel";

const TicketWarrantyOperationApproveComopnent = ({ item }) => {
  const reloadPage = useNavigateCustomize();
  const noticeError = useSetRecoilState(noticeErrorState);
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const setLoading = useSetRecoilState(loadingState);
  const [modal, setModal] = useState();

  const cancel = (action, note) => {
    setModal({ ...modal, cancel: false });
    if (action === "cancel") return;

    setLoading(true);
    create(`${TICKETS}/${item?.id}/${REPORT_ERROR}/${REJECT}`, {
      reason_refuse: note,
    })
      .then((response) => {
        noticeSuccess("Từ chối thành công");
        reloadPage();
      })
      .catch((error) => {
        noticeError(error?.message);
        setLoading(false);
      });
  };

  const confirm = (action) => {
    setModal({ ...modal, approve: false });
    if (action === "cancel") return;

    setLoading(true);
    create(`${TICKETS}/${item?.id}/${REPORT_ERROR}/${APPROVE}`)
      .then((response) => {
        noticeSuccess("Duyệt thành công");
        reloadPage();
      })
      .catch((error) => {
        noticeError(error?.message);
        setLoading(false);
      });
  };

  return (
    <>
      <div className="bg-white p-4 mt-4 rounded-lg">
        <Text.Title>Báo lỗi vận hành</Text.Title>

        <InfoMediaComponent
          images={item?.report_after_images}
          videos={item?.report_after_videos}
        />

        <hr className="my-4 bg-[#ddd] h-[2px]" />

        <InfoDescriptionComponent
          title="Mô tả tình trạng"
          text={item?.report_after_content}
        />

        {item?.can_report_error_approve && (
          <div
            className={`flex flex-row mt-3 ${hasPermission([
              ...perTicketDefault,
              PER_ASSET_TICKET_REPORT_ERROR,
            ])}`}
          >
            <div className={`flex-1 pr-1`}>
              <Button
                fullWidth
                type="danger"
                variant="secondary"
                onClick={() => setModal({ ...modal, cancel: true })}
              >
                Từ chối
              </Button>
            </div>
            <div className={`flex-1 pl-1`}>
              <Button
                fullWidth
                onClick={() => setModal({ ...modal, approve: true })}
              >
                Duyệt
              </Button>
            </div>

            <ModalCancelComponent isVisible={modal?.cancel} action={cancel} />

            <ModalApproveComponent
              isVisible={modal?.approve}
              action={confirm}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default TicketWarrantyOperationApproveComopnent;
