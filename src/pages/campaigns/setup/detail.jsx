import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useSetRecoilState } from "recoil";
import { Page } from "zmp-ui";
import AccordionComponent from "../../../components/accordion";
import CampaignInfoComponent from "../../../components/campaign/info";
import CampaignBannerComponent from "../../../components/campaign/info/banner";
import CampaignConditionsComponent from "../../../components/campaign/info/conditions";
import HeaderComponent from "../../../components/header";
import { apiClient, create } from "../../../services/api";
import { loadingState } from "../../../store/loading";
import { noticeErrorState, noticeSuccessState } from "../../../store/notice";
import { SETUP_DETAIL } from "../../../utils/constApiRoute";
import useNavigateCustomize from "../../../hook/navigate/useNavigateCustom";
import CampaignItemsSetupComponent from "../../../components/campaign/info/itemsSetup";
import SheetJoinCampaignSetup from "../../../components/sheet/joinCampaignSetup";
import useQueryParams from "../../../hook/query/useQueryParams";

const CampaignSetupDetailPage = () => {
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
    setLoading(true);
    await apiClient
      .get(`${SETUP_DETAIL}/${id}/outlet`, {
        params: {
          customer_id: customerId,
        },
      })
      .then((response) => {
        setItem(response?.data?.setup_app);
        setAccordion(response?.data?.setup_app);
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  const setAccordion = (data) => {
    setListAcc([
      {
        title: "Thiết bị áp dụng",
        component: <CampaignItemsSetupComponent item={data?.setup_app_item} />,
        key: "info3",
        bg: true,
        isOne: true,
      },
    ]);
  };

  const sheetAction = useCallback((type, data) => {
    setIsVisible(false);
    if (type === "cancel") return;

    setLoading(true);

    create(`${SETUP_DETAIL}/${id}/results`, data)
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
    const customerId = query.get("customerId");
    getItem(customerId);
  }, []);

  return (
    <Page className="page " style={{ paddingTop: "60px" }} hideScrollbar={true}>
      <HeaderComponent title="Chi tiết chương trình lắp đặt" />
      <CampaignBannerComponent src={item?.banner_images} />

      <CampaignConditionsComponent
        item={item}
        hasButton={true}
        titleButton={
          item?.registered ? "Đã có yêu cầu lắp đặt" : "Đăng ký ngay"
        }
        disableButton={item?.registered}
        action={() => setIsVisible(true)}
      />

      <AccordionComponent list={listAcc} />

      <CampaignInfoComponent
        images={item?.desc_images ?? []}
        note={item?.note}
      />

      <SheetJoinCampaignSetup
        item={item}
        isVisible={isVisible}
        action={sheetAction}
      />
    </Page>
  );
};

export default CampaignSetupDetailPage;
