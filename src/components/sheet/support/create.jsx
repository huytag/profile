import React, { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Box, Text, Button, Input, Sheet } from "zmp-ui";
import { loadingState } from "../../../store/loading";
import { noticeErrorState, noticeSuccessState } from "../../../store/notice";
import { SUPPORT } from "../../../utils/constApiRoute";
import { mediaImagesState } from "../../../store/media";
import UploadMediaTicketComponent from "../../upload/ticket";
import { create } from "../../../services/api";
import useNavigateCustomize from "../../../hook/navigate/useNavigateCustom";

const SheetCreateSupport = ({ supportId, isVisible, action }) => {
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const setLoading = useSetRecoilState(loadingState);
  const imagesStore = useRecoilValue(mediaImagesState);
  const reloadPage = useNavigateCustomize();
  const [formData, setFormData] = useState({
    message: "",
    images: [],
  });

  const onCreateSupport = () => {
    setLoading(true);
    const data = {
      ...formData,
      images: imagesStore,
      support_id: supportId,
    };

    create(`${SUPPORT}/${supportId}/activities`, data)
      .then((res) => {
        noticeSuccess("Trả lời thành công.");
        action("success");
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  return (
    <Sheet
      visible={isVisible}
      title="Trả lời"
      onClose={() => action("cancel")}
      autoHeight
      mask
      handler
      swipeToClose
      unmountOnClose={true}
    >
      <Box
        p={5}
        flex
        flexDirection="column"
        justifymessage="space-between"
        className="text-4xl bg-white rounded-xl shadow-lg shadow-black-500/50 h-full"
      >
        <Box>
          <Box className="my-3">
            <Text.Title>Mô tả vấn đề</Text.Title>
            <Input.TextArea
              className="text-base pb-10"
              placeholder=""
              maxLength="300"
              showCount
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
            ></Input.TextArea>
          </Box>

          <Box className="my-3">
            <UploadMediaTicketComponent
              titleImage="Hình ảnh minh hoạ"
              isAddVideo={false}
            />
          </Box>
        </Box>

        <Box
          className={"custom-bottom-sheet mt-5 w-full"}
          flex
          flexDirection="column"
        >
          <div>
            <Box flex flexDirection="row" mt={1}>
              <div className={`flex-1 pr-1 `}>
                <Button
                  to="support"
                  fullWidth
                  type="danger"
                  size="large"
                  variant="secondary"
                  onClick={() => action("cancel")}
                >
                  Huỷ
                </Button>
              </div>
              <div className={`flex-1 pr-1 `}>
                <Button
                  fullWidth
                  variant="primary"
                  disabled={!formData.message}
                  onClick={onCreateSupport}
                >
                  Gửi yêu cầu
                </Button>
              </div>
            </Box>
          </div>
        </Box>
      </Box>
    </Sheet>
  );
};

export default SheetCreateSupport;
