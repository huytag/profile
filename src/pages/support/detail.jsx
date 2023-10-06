import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { useParams } from "react-router";
import { useSetRecoilState } from "recoil";
import { Box, Button, Page, Text } from "zmp-ui";
import HeaderComponent from "../../components/header";
import ModalApproveComponent from "../../components/modal/approve";
import SheetCreateSupport from "../../components/sheet/support/create";
import ItemDetailResponse from "../../components/support/detail";
import useNavigateCustomize from "../../hook/navigate/useNavigateCustom";
import { apiClient, detail } from "../../services/api";
import { loadingState } from "../../store/loading";
import { noticeErrorState, noticeSuccessState } from "../../store/notice";
import { parseUtcToLocal } from "../../utils";
import { SUPPORT } from "../../utils/constApiRoute";
import { STATUS_SUPPORT } from "../../utils/enum/support";
import { labelText } from "../../utils/label";

const DetailSupportPage = () => {
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const setLoading = useSetRecoilState(loadingState);
  const reload = useNavigateCustomize();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState({
    create: false,
    success: false,
  });

  const getSupportDetail = async () => {
    setLoading(true);
    const res = await detail(SUPPORT, id)
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
    return res?.data?.support;
  };

  const { data } = useQuery({
    queryKey: ["support", id],
    queryFn: () => getSupportDetail(),
  });

  const resetQuery = () => {
    queryClient.removeQueries({ queryKey: ["support", id] });
    queryClient.removeQueries({ queryKey: ["supports"] });
    reload();
  };

  const labelClass = useMemo(
    () => labelText(data?.status ?? 0),
    [data?.status]
  );

  const onCreateSupport = (value) => {
    setIsOpen({ ...isOpen, create: false });
    if (value === "cancel") return;
    if (value === "success") resetQuery();
  };

  const onSuccessSupport = async (value) => {
    setIsOpen({ ...isOpen, success: false });
    if (value === "cancel") return;

    setLoading(true);
    await apiClient
      .put(`${SUPPORT}/${id}/complete`)
      .then((res) => {
        noticeSuccess("Đã hoàn thành.");
        resetQuery();
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  return (
    <Page
      className="page px-2"
      style={{ paddingTop: "60px", paddingBottom: "90px" }}
      hideScrollbar={true}
    >
      <HeaderComponent title="Chi tiết yêu cầu hỗ trợ" />

      <Box className="px-5 py-3 text-4xl items-center mt-4 bg-white rounded-xl shadow-lg shadow-black-500/50">
        <Box className="flex justify-between">
          <Text.Title size="xLarge" className="font-semibold">
            {data?.category_title}
          </Text.Title>
          <span
            className={`w-[120px] rounded-md flex items-center justify-center text-white  ${labelClass}`}
          >
            <Text size="xSmall" className="relative">
              {data?.status_text}
            </Text>
          </span>
        </Box>
        <Box className="mt-3">
          <div className="flex items-center mb-1">
            <Text size="small" className="font-semibold">
              Mã yêu cầu:
            </Text>
            <Text size="small" className="ml-2 text-gray-500">
              {data?.code}
            </Text>
          </div>
          <div className="flex items-center mb-1">
            <Text size="small" className="font-semibold">
              Ngày cập nhật gần nhất:
            </Text>
            <Text size="small" className="ml-2 text-gray-500">
              {parseUtcToLocal(data?.updated_at, "DD/MM/YYYY HH:mm")}
            </Text>
          </div>
        </Box>
      </Box>

      {data?.activities?.map((detail, index) => {
        return <ItemDetailResponse item={detail} key={index} />;
      })}

      {data?.status !== STATUS_SUPPORT.CLOSED && (
        <Box className="mt-5 w-full" flex flexDirection="column">
          <Box flex flexDirection="row" mt={1}>
            <div className={`flex-1 pr-1 `}>
              <Button
                fullWidth
                type="highlight"
                size="large"
                variant="secondary"
                onClick={() => setIsOpen({ ...isOpen, create: true })}
              >
                Trả lời
              </Button>
            </div>
            <div className={`flex-1 pr-1 `}>
              <Button
                fullWidth
                variant="primary"
                onClick={() => setIsOpen({ ...isOpen, success: true })}
              >
                Đã hoàn thành
              </Button>
            </div>
          </Box>
        </Box>
      )}

      <SheetCreateSupport
        supportId={data?.id}
        isVisible={isOpen.create}
        action={(value) => onCreateSupport(value)}
      />

      <ModalApproveComponent
        isVisible={isOpen.success}
        action={(value) => onSuccessSupport(value)}
        title="Xác nhận hoàn thành"
      />
    </Page>
  );
};

export default DetailSupportPage;
