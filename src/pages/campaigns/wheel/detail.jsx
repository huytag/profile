import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { Page, Text } from "zmp-ui";
import CampaignInfoComponent from "../../../components/campaign/info";
import HeaderComponent from "../../../components/header";
import IconGiftColor from "../../../components/icon/GiftColor";
import LuckyWheelComponent from "../../../components/luckyWheel";
import useQueryParams from "../../../hook/query/useQueryParams";
import { apiClient } from "../../../services/api";
import { canViewReport } from "../../../services/hasPermission";
import noImage from "../../../static/no-image.png";
import { loadingState } from "../../../store/loading";
import { noticeErrorState } from "../../../store/notice";
import { LUCKY_APP } from "../../../utils/constApiRoute";
import { PER_TRADE_LUCKY_REPORT_VIEW } from "../../../utils/enumPermission";

const CampaignWheelDetailPage = () => {
  const setLoading = useSetRecoilState(loadingState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const { id } = useParams();
  const [luckyApp, setLuckyApp] = useState({});
  const query = useQueryParams();
  const customerId = query.get("customerId");

  const fetchDetail = async (customerId = null) => {
    setLoading(true);
    await apiClient
      .get(`${LUCKY_APP}/${id}`, {
        params: {
          customer_id: customerId,
        },
      })
      .then((response) => setLuckyApp(response?.data?.lucky_app))
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  const onHandleLucky = useCallback(() => {
    setLuckyApp({
      ...luckyApp,
      detail: {
        ...luckyApp.detail,
        draw_remaining: luckyApp.detail.draw_remaining - 1,
      },
    });
  });

  useEffect(() => {
    fetchDetail(customerId);
  }, []);

  return (
    <Page className="page " style={{ paddingTop: "60px" }} hideScrollbar={true}>
      <HeaderComponent title="Chi tiết quay số" />

      <div className="bg-white p-4 rounded-lg text-center overflow-hidden">
        <Link
          to={`/campaigns/wheel-history${
            canViewReport(PER_TRADE_LUCKY_REPORT_VIEW)
              ? `?customerId=${customerId}`
              : ""
          }`}
          className="flex items-center justify-end border-[#000000] mt-2 fixed right-2 bottom-[35%] z-[1000]"
        >
          <IconGiftColor className="w-10 text-white transition-all hover:scale-125 focus:scale-125" />
        </Link>

        <Text.Title className="text-4xl">Vòng quay</Text.Title>
        <Text.Title className="text-6xl text-[#085394] font-bold">
          May mắn
        </Text.Title>
        <div className="my-5">
          {luckyApp && (
            <LuckyWheelComponent item={luckyApp} action={onHandleLucky} />
          )}
        </div>
        <Text>
          Số lượt quay còn lại:{" "}
          <span className="text-[#085394] font-bold text-xl">
            {luckyApp?.detail?.draw_remaining}
          </span>
        </Text>
        <Text>
          {luckyApp?.detail?.draw_remaining <= 0 &&
            luckyApp?.detail?.spin_over_content}
        </Text>

        <Text.Title className="text-xl mt-5 border-t-2 border-dashed border-[#dddddd] pt-4">
          Gợi ý thêm lượt quay
        </Text.Title>
        <div className="flex mt-4 bg-[#085394] text-white p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full ticket-ui-left"></div>
          <div className="absolute top-0 left-0 w-full h-full ticket-ui-right"></div>
          <img src={noImage} className="w-[25vw] h-[25vw] object-cover" />
          <div className="ml-3 text-left flex flex-col justify-between divide-ticket relative pl-2">
            <Text> {luckyApp?.detail?.spin_suggest_content}</Text>
            <div>
              Giải thưởng <img className="w-[20px] inline" src={noImage} /> x1
            </div>
          </div>
        </div>
      </div>

      <CampaignInfoComponent
        title="Thể lệ chương trình"
        images={luckyApp?.condition_images}
        note={luckyApp?.note}
        mt={3}
      />
    </Page>
  );
};

export default CampaignWheelDetailPage;
