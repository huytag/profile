import React, { useEffect, useState } from "react";
import { Box, Page, Text, Input, Button } from "zmp-ui";
import HeaderComponent from "../../../components/header";
import CampaignBannerComponent from "../../../components/campaign/info/banner";
import AccumulationPrizeComponent from "../../../components/campaign/accumulation/prize";
import { noticeErrorState, noticeSuccessState } from "../../../store/notice";
import { useSetRecoilState } from "recoil";
import { loadingState } from "../../../store/loading";
import { useParams } from "react-router";
import { apiClient, create } from "../../../services/api";
import {
  ACCUMULATE_DETAIL,
  ACCUMULATE_RESULT_DETAIL,
} from "../../../utils/constApiRoute";
import useNavigateCustomize from "../../../hook/navigate/useNavigateCustom";
import {
  JOINING,
  REFUSE_TO_PARTICIPATE,
  WAITING_FOR_REVIEW_AND_PAYMENT,
} from "../../../utils/enumsAccumulateResult";
import CampaignStatusComponent from "../../../components/campaign/info/status";
import { parseUtcToLocal } from "../../../utils";
import useQueryParams from "../../../hook/query/useQueryParams";
import { canViewReport } from "../../../services/hasPermission";
import { PER_TRADE_ACCUMULATE_REPORT_VIEW } from "../../../utils/enumPermission";

const CampaignAccumulationDetailPage = () => {
  const { id } = useParams();
  const reloadPage = useNavigateCustomize();
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const setLoading = useSetRecoilState(loadingState);
  const [item, setItem] = useState();
  const [idChecked, setIdChecked] = useState(null);
  const [data, setData] = useState();
  const query = useQueryParams();

  const onRegister = () => {
    if (!idChecked) {
      noticeError("Vui lòng chọn hạng mức");
      return;
    }

    setLoading(true);
    create(`${ACCUMULATE_DETAIL}/${id}/results`, {
      ...data,
      accumulate_app_level_id: idChecked,
    })
      .then((res) => {
        noticeSuccess("Đăng ký thành công");
        reloadPage();
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  const fetchItem = async (customerId) => {
    setLoading(true);

    await apiClient
      .get(`${ACCUMULATE_DETAIL}/${id}`, {
        params: {
          customer_id: customerId,
        },
      })
      .then((res) => {
        setItem(res.data.accumulate_app);
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const customerId = query.get("customerId");
    fetchItem(customerId);
  }, []);

  return (
    <Page
      className="page px-2"
      style={{ paddingTop: "60px" }}
      hideScrollbar={true}
    >
      <HeaderComponent title="Chi tiết chương trình tích luỹ" />

      <CampaignBannerComponent src={item?.banner_images} />

      <Box className="px-5 py-3 text-4xl items-center mt-4 bg-white rounded-xl shadow-lg shadow-black-500/50">
        <Box className="flex justify-between">
          <Text.Title size="xLarge" className="font-semibold">
            {item?.name}
          </Text.Title>
          <span className="flex items-center justify-center rounded-md  text-white  bg-indigo-600 px-2">
            <Text size="xSmall" className="relative">
              {item?.accumulate_app_result?.status_text ?? "Chưa tham gia"}
            </Text>
          </span>
        </Box>

        <Box className="mt-3">
          <div className="flex items-center mb-1">
            <Text size="small" className="font-semibold  ">
              Mã chương trình
            </Text>
            <Text size="small" className="ml-2 text-gray-500">
              {item?.code}
            </Text>
          </div>
          <div className="flex items-center mb-1">
            <Text size="small" className="font-semibold  ">
              Ngày đăng ký:
            </Text>
            <Text size="small" className="ml-2 text-gray-500">
              {`${parseUtcToLocal(item?.created_from_date, "DD/MM/YYYY")} 
              - ${parseUtcToLocal(item?.created_to_date, "DD/MM/YYYY")}`}
            </Text>
          </div>

          <div className="flex items-center mb-1">
            <Text size="small" className="font-semibold ">
              Ngày thực hiện:
            </Text>
            <Text size="small" className="ml-2 text-gray-500">
              {`${parseUtcToLocal(item?.start_date, "DD/MM/YYYY")} 
              - ${parseUtcToLocal(item?.end_date, "DD/MM/YYYY")}`}
            </Text>
          </div>
        </Box>
      </Box>

      {item?.accumulate_app_result?.status >= JOINING &&
      item?.accumulate_app_result?.status !== REFUSE_TO_PARTICIPATE ? (
        <Box className="px-5 py-3 text-4xl items-center mt-4 bg-white rounded-xl shadow-lg shadow-black-500/50">
          <Box className="flex justify-between">
            <Text.Title size="large" className="font-semibold">
              Tiến độ thực hiện
            </Text.Title>
          </Box>

          <Box className="mt-3">
            {item?.accumulate_app_result_progresses.map((i, index) => (
              <Text size="normal" className="font-bold ml-5 my-1" key={index}>
                {i?.key}:{" "}
                <span className="text-gray-400 font-normal">{i?.value}</span>
              </Text>
            ))}
          </Box>
        </Box>
      ) : (
        ""
      )}

      {item?.accumulate_app_result?.status >=
        WAITING_FOR_REVIEW_AND_PAYMENT && (
        <Box>
          <CampaignStatusComponent
            item={item?.accumulate_app_result}
            urlComfirm={`${ACCUMULATE_RESULT_DETAIL}/${item?.accumulate_app_result?.id}/confirm-reward`}
          />
        </Box>
      )}

      <Box className="px-5 py-3 text-4xl items-center mt-3 bg-white rounded-xl shadow-lg shadow-black-500/50">
        <Text.Title className="text-center font-semibold my-2">
          Mức tham gia
        </Text.Title>

        {item?.accumulate_app_result 
            ? <AccumulationPrizeComponent
                prize={item?.accumulate_app_result.level}
                isResult
                action={(value) => setIdChecked(value?.id)}
              /> 
            : item?.accumulate_app_levels.map((prize, index) => {
              return (
                <AccumulationPrizeComponent
                  prize={prize}
                  key={index}
                  idChecked={idChecked}
                  action={(value) => setIdChecked(value?.id)}
                />
              );
            })
            }

        <Box className="mt-5">
          <Text.Title size="small">Ghi chú</Text.Title>
          <div
            className="text-lg font-medium ml-3 mb-3"
            dangerouslySetInnerHTML={{ __html: item?.note ?? "" }}
          />
        </Box>
        
        {!item?.accumulate_app_result &&
          !canViewReport(PER_TRADE_ACCUMULATE_REPORT_VIEW) && (
            <Button className="w-full" onClick={onRegister}>
              Đăng ký tham gia
            </Button>
          )}
      </Box>

    </Page>
  );
};

export default CampaignAccumulationDetailPage;
