import React, { useState } from "react";
import { Box, Button, Input, Text } from "zmp-ui";
import UploadMediaTicketComponent from "../../upload/ticket";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { mediaImagesState, mediaVideosState } from "../../../store/media";
import { create } from "../../../services/api";
import { loadingState } from "../../../store/loading";
import { noticeErrorState, noticeSuccessState } from "../../../store/notice";
import { empty } from "../../../utils";
import { REPORT_AFTER, REQUEST, TICKETS } from "../../../utils/constApiRoute";
import ErrorComponent from "../../error";
import ModalApproveComponent from "../../modal/approve";
import useNavigateCustomize from "../../../hook/navigate/useNavigateCustom";

const StaffReportAfterRepairComponent = ({ item }) => {
  const reloadPage = useNavigateCustomize();
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const setLoading = useSetRecoilState(loadingState);
  const imagesStore = useRecoilValue(mediaImagesState);
  const videosStore = useRecoilValue(mediaVideosState);
  const [isShowReport, setIsShowReport] = useState(false);
  const [data, setData] = useState({
    report_after_content: "",
    report_after_images: imagesStore,
    report_after_videos: videosStore,
  });

  const [errors, setErrors] = useState({
    report_after_content: false,
    report_after_images: false,
  });

  const isValidated = () => {
    const textRequired = "Vui lòng chọn";
    const newErrors = {
      report_after_content: empty(data.report_after_content) && textRequired,
      report_after_images: imagesStore.length < 2 && textRequired,
    };

    setErrors({ ...errors, ...newErrors });

    const isAllValidate = !Object.values(newErrors).some(Boolean);
    if (!isAllValidate) {
      noticeError("Vui lòng chọn đủ các trường bị thiếu");
      return false;
    }

    return true;
  };

  const onReport = (type) => {
    setIsShowReport(false);
    if (type === "cancel") return;

    if (!isValidated()) return;

    setLoading(true);
    const dataCreate = {
      ...data,
      report_after_images: imagesStore,
      report_after_videos: videosStore,
    };

    create(`${TICKETS}/${item?.id}/${REPORT_AFTER}/${REQUEST}`, dataCreate)
      .then((response) => {
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
        title={errors.report_after_images}
        isShow={imagesStore.length < 2 && errors.report_after_images}
      />

      <Text.Title size="small" className="mt-5">
        Mô tả tình trạng
      </Text.Title>
      <Input.TextArea
        className="custom-class"
        placeholder="Nhập tình trạng sản phẩm"
        showCount={false}
        value={data.report_after_content}
        onChange={(e) =>
          setData({ ...data, report_after_content: e.target.value })
        }
        errorText={errors.report_after_content}
      />

      <Box
        className={`custom-bottom-sheet mt-2 w-full bg-white rounded-md`}
        flex
        flexDirection="column"
      >
        <div>
          <Box flex flexDirection="row" mt={1}>
            <div
              className={`flex-1 pr-1 ${!item?.can_report_after && "hidden"}`}
            >
              <Button
                disabled={
                  empty(data.report_after_content) || imagesStore.length < 2
                }
                fullWidth
                variant="primary"
                onClick={() => setIsShowReport(true)}
              >
                Gửi báo cáo
              </Button>
            </div>
          </Box>
        </div>
      </Box>

      <ModalApproveComponent
        isVisible={isShowReport}
        action={(type) => onReport(type)}
        title="Đồng ý gửi báo cáo"
      />
    </div>
  );
};

export default StaffReportAfterRepairComponent;
