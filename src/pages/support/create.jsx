import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Box, Page, Text, Button, Input, useNavigate } from "zmp-ui";
import HeaderComponent from "../../components/header";
import UploadMediaTicketComponent from "../../components/upload/ticket";
import { create } from "../../services/api";
import { userInfo } from "../../services/hasPermission";
import { loadingState } from "../../store/loading";
import { mediaImagesState } from "../../store/media";
import { noticeErrorState, noticeSuccessState } from "../../store/notice";
import { DROPDOWN_TRADE, SUPPORT } from "../../utils/constApiRoute";
import { useQueryClient } from "@tanstack/react-query";
import useDropdown from "../../hook/dropdown/useDropdown";
import Select2Component from "../../components/select2";
import { SUPPORT_CATEGORIES } from "../../utils/enumDropdown";

const CreateSupportPage = () => {
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const setLoading = useSetRecoilState(loadingState);
  const imagesStore = useRecoilValue(mediaImagesState);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    message: "",
    support_category_id: null,
    images: [],
    customer_id: userInfo?.id,
  });
  const queryClient = useQueryClient();
  const { options, getOptions } = useDropdown();

  const onCreateSupport = () => {
    setLoading(true);
    const data = {
      ...formData,
      images: imagesStore,
    };

    create(`${SUPPORT}`, data)
      .then((res) => {
        noticeSuccess("Tạo yêu cầu thành công.");
        queryClient.removeQueries({ queryKey: ["supports"] });
        navigate("/support");
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getOptions(DROPDOWN_TRADE, [SUPPORT_CATEGORIES]);
  }, []);

  return (
    <Page
      className="page px-2"
      style={{ paddingTop: "60px" }}
      hideScrollbar={true}
    >
      <HeaderComponent title="Tạo yêu cầu hỗ trợ" />

      <Box
        p={5}
        flex
        flexDirection="column"
        justifymessage="space-between"
        className="text-4xl bg-white rounded-xl shadow-lg shadow-black-500/50 h-full"
      >
        <Box>
          <Text.Title className="border-b border-[#333] pb-2">
            Yêu cầu hỗ trợ
          </Text.Title>

          <Box className="my-3">
            <Text.Title>Chủ đề</Text.Title>

            <Select2Component
              isError={formData.support_category_id}
              options={options?.support_categories}
              onSelect={(value) =>
                setFormData({ ...formData, support_category_id: value })
              }
              placeholder="Tủ lạnh 1 cánh / Điều hoà cây / ...."
            />
          </Box>

          <Box className="my-3">
            <Text.Title>Mô tả lý do yêu cầu lắp đặt</Text.Title>
            <Input.TextArea
              placeholder="Mô tả vấn đề"
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              size="small"
              className="text-base pb-10"
              maxLength="300"
              showCount
              clearable
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
                <Link to="/support">
                  <Button
                    to="support"
                    fullWidth
                    type="danger"
                    size="large"
                    variant="secondary"
                  >
                    Huỷ
                  </Button>
                </Link>
              </div>
              <div className={`flex-1 pr-1 `}>
                <Button
                  fullWidth
                  variant="primary"
                  disabled={!formData.message || !formData.support_category_id}
                  onClick={onCreateSupport}
                >
                  Gửi yêu cầu
                </Button>
              </div>
            </Box>
          </div>
        </Box>
      </Box>
    </Page>
  );
};

export default CreateSupportPage;
