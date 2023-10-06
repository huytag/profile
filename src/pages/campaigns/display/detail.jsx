import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useSetRecoilState } from "recoil";
import { Page } from "zmp-ui";
import AccordionComponent from "../../../components/accordion";
import CampaignInfoComponent from "../../../components/campaign/info";
import CampaignBannerComponent from "../../../components/campaign/info/banner";
import CampaignConditionsComponent from "../../../components/campaign/info/conditions";
import CampaignStatusComponent from "../../../components/campaign/info/status";
import CampaignItemBorrowComponent from "../../../components/campaign/info/itemBorrow";
import HeaderComponent from "../../../components/header";
import SheetJoinCampaignDisplay from "../../../components/sheet/joinCampaignDisplay";
import { apiClient, create } from "../../../services/api";
import { loadingState } from "../../../store/loading";
import { noticeErrorState, noticeSuccessState } from "../../../store/notice";
import {
  DISPLAY_DETAIL,
  DISPLAY_RESULT_DETAIL,
} from "../../../utils/constApiRoute";
import CampaignResultDisplayComponent from "../../../components/campaign/info/resultDisplay";
import useNavigateCustomize from "../../../hook/navigate/useNavigateCustom";
import * as StatusApp from "../../../utils/enumDisplayApp";
import { canViewReport } from "../../../services/hasPermission";
import useQueryParams from "../../../hook/query/useQueryParams";
import CampaignPrizeItemComponent from "../../../components/campaign/info/prizeItem";
import { PER_TRADE_DISPLAY_REPORT_VIEW } from "../../../utils/enumPermission";
import { empty } from "../../../utils";

const CampaignDisplayDetailPage = () => {
  const { id } = useParams();
  const reloadPage = useNavigateCustomize();
  const setLoading = useSetRecoilState(loadingState);
  const noticeSuccess = useSetRecoilState(noticeSuccessState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const [isVisible, setIsVisible] = useState(false);
  const [item, setItem] = useState([]);
  const [listAcc, setListAcc] = useState([]);
  const query = useQueryParams();

  const getItem = async (customerId) => {
    await apiClient
      .get(`${DISPLAY_DETAIL}/${id}/outlet`, {
        params: {
          customer_id: customerId,
        },
      })
      .then((response) => {
        setItem(response?.data?.display_app);
        setAccordion(response?.data?.display_app);
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  const setAccordion = (data) => {
    let newData = [
      {
        title: "Chương trình lắp mới liên kết",
        component: (
          <CampaignItemBorrowComponent
            appId={id}
            items={data?.display_app_setups ?? []}
          />
        ),
        key: "info3",
        bg: true,
        isOne: true,
      },
    ];

    const displayAppStatus = data?.display_app_result?.status;

    if (
      displayAppStatus >= StatusApp.JOINING &&
      displayAppStatus !== StatusApp.REFUSE_TO_PARTICIPATE
    ) {
      newData.push({
        title: "Mức thưởng",
        component: (
          <CampaignPrizeItemComponent
            item={data?.display_app_result?.bonus}
            isPrize
          />
        ),
        key: "campaign-prize",
        bg: true,
        isOne: true,
      });

      data?.display_app_reports.map((item, index) => {
        newData.push({
          title: `Báo cáo kết quả trưng bày ${index + 1}`,
          component: (
            <CampaignResultDisplayComponent
              item={item}
              report={data?.display_app_result?.reports[index] ?? {}}
              resultId={data?.display_app_result?.id}
            />
          ),
          key: `report_${index}`,
          bg: true,
          isOne: true,
        });
      });
    }

    setListAcc([...newData]);
  };

  const sheetAction = useCallback((type, data) => {
    setIsVisible(false);
    if (type === "cancel") return;

    setLoading(true);

    create(`${DISPLAY_DETAIL}/${id}/results`, data[0])
      .then(() => {
        noticeSuccess("Đăng ký thành công");
        reloadPage();
      })
      .catch((error) => {
        noticeError(error?.message);
        setLoading(false);
      });
  });

  useEffect(() => {
    setLoading(true);
    const customerId = query.get("customerId");
    getItem(customerId);
  }, []);

  return (
    <Page className="page " style={{ paddingTop: "60px" }} hideScrollbar={true}>
      <HeaderComponent title="Chi tiết trưng bày" />

      <CampaignBannerComponent src={item?.banner_images} />

      <CampaignConditionsComponent
        item={item}
        hasButton={!canViewReport(PER_TRADE_DISPLAY_REPORT_VIEW)}
        isCreatedDay
        disableButton={item?.display_app_result}
        action={() => {
          if (empty(item?.display_app_bonuses)) {
            return noticeError("Không có mức tham gia");
          }

          setIsVisible(true);
        }}
      />

      <CampaignStatusComponent
        item={item?.display_app_result}
        urlComfirm={`${DISPLAY_RESULT_DETAIL}/${item?.display_app_result?.id}/reward`}
      />

      <AccordionComponent list={listAcc} />

      <CampaignInfoComponent
        images={item?.desc_images ?? []}
        note={item?.note}
      />

      <SheetJoinCampaignDisplay
        items={item?.display_app_bonuses ?? []}
        isVisible={isVisible}
        action={sheetAction}
      />
    </Page>
  );
};

export default CampaignDisplayDetailPage;
