import React, { useState } from "react";
import { Box, Button, Input, Text } from "zmp-ui";
import UploadMediaTicketComponent from "../../upload/ticket";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { mediaImagesState, mediaVideosState } from "../../../store/media";
import { create } from "../../../services/api";
import { REPORT_BEFORE, REQUEST, TICKETS } from "../../../utils/constApiRoute";
import { loadingState } from "../../../store/loading";
import { noticeErrorState, noticeSuccessState } from "../../../store/notice";
import { empty } from "../../../utils";
import ModalApproveComponent from "../../modal/approve";
import useNavigateCustomize from "../../../hook/navigate/useNavigateCustom";
import ErrorComponent from "../../error";

const TicketReportBeforeRepairComponent = ({ item }) => {
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const setLoading = useSetRecoilState(loadingState);
  const imagesStore = useRecoilValue(mediaImagesState);
  const videosStore = useRecoilValue(mediaVideosState);
  const [content, setContent] = useState("");
  const [isShowApprove, setIsShowApprove] = useState(false);
  const reloadPage = useNavigateCustomize();
  const [errors, setErrors] = useState({
    report_before_content: false,
    report_before_images: false,
  });

  const isValidated = () => {
    setErrors({
      report_before_content: empty(content) && "Vui lòng chọn",
      report_before_images: imagesStore.length < 2 && "Vui lòng chọn",
    });

    const isAllValidate = !Object.values(errors).some(Boolean);
    if (!isAllValidate) {
      noticeError("Vui lòng chọn đủ các trường bị thiếu");
      return false;
    }

    return true;
  };

  const onApprove = (type) => {
    if (type === "cancel") {
      setIsShowApprove(false);
      return;
    }

    setLoading(true);
    createReportRepair();
  };

  const createReportRepair = () => {
    console.log(!isValidated());
    if (!isValidated()) return;

    const data = {
      item_id: item?.id,
      report_before_content: content,
      report_before_images: imagesStore,
      report_before_videos: videosStore,
    };

    create(`${TICKETS}/${item?.id}/${REPORT_BEFORE}/${REQUEST}`, data)
      .then((res) => {
        noticeSuccess("Tạo yêu cầu thành công.");
        reloadPage();
      })
      .catch((error) => noticeError(error?.message));
  };

  return (
    <div className="rounded-xl text-4xl mt-2">
      <Text className="-mb-4 text-red-500 mt-3" size="xxSmall">
        * Phải có ít nhất 2 hình và mô tả tình trạng
      </Text>
      <UploadMediaTicketComponent />
      <ErrorComponent
        title={errors.report_before_images}
        isShow={imagesStore.length < 2 && errors.report_before_images}
      />

      <Text.Title size="small" className="mt-5">
        Mô tả tình trạng
      </Text.Title>
      <Input.TextArea
        className="custom-class"
        placeholder="Nhập tình trạng sản phẩm"
        showCount={false}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        errorText={errors.content}
      />

      <Box
        className={`custom-bottom-sheet mt-2 w-full bg-white rounded-md`}
        flex
        flexDirection="column"
      >
        <div>
          <Box flex flexDirection="row" mt={1}>
            <div
              className={`flex-1 pr-1 ${!item?.can_report_before && "hidden"}`}
            >
              <Button
                disabled={empty(content) || imagesStore.length < 2}
                fullWidth
                variant="primary"
                onClick={() => setIsShowApprove(!isShowApprove)}
              >
                Gửi báo cáo
              </Button>
            </div>
          </Box>
        </div>
      </Box>

      <ModalApproveComponent
        title="Đồng ý gửi báo cáo"
        isVisible={isShowApprove}
        action={(type) => onApprove(type)}
      />
    </div>
  );
};

export default TicketReportBeforeRepairComponent;
