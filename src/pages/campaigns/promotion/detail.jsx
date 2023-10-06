import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useSetRecoilState } from "recoil";
import { Page } from "zmp-ui";
import AccordionComponent from "../../../components/accordion";
import CampaignInfoComponent from "../../../components/campaign/info";
import CampaignBannerComponent from "../../../components/campaign/info/banner";
import CampaignConditionsComponent from "../../../components/campaign/info/conditions";
import CampaignPrizeComponent from "../../../components/campaign/info/prize";
import HeaderComponent from "../../../components/header";
import useQueryParams from "../../../hook/query/useQueryParams";
import { apiClient } from "../../../services/api";
import { loadingState } from "../../../store/loading";
import { noticeErrorState } from "../../../store/notice";
import { PROMOTION_DETAIL } from "../../../utils/constApiRoute";

const CampaignPromotionDetailPage = () => {
  const { id } = useParams();
  const setLoading = useSetRecoilState(loadingState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const [item, setItem] = useState([]);
  const [listAcc, setListAcc] = useState();
  const query = useQueryParams();

  const getItem = async (customerId) => {
    setLoading(true);

    await apiClient
      .get(`${PROMOTION_DETAIL}/${id}`, {
        params: {
          customer_id: customerId,
        },
      })
      .then((response) => {
        setItem(response?.data?.promotion_app);
        asignAccordion(response?.data?.promotion_app);
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  const asignAccordion = (list) => {
    let arrAcc = [];

    if (list?.has_product) {
      arrAcc.push({
        title: "Sản phẩm áp dụng",
        component: (
          <CampaignPrizeComponent
            items={list?.promotion_app_product_applies ?? []}
            isProduct
          />
        ),
        key: "info3",
        bg: true,
      });
    }

    if (list?.has_gift) {
      arrAcc.push({
        title: "Mặt hàng tặng",
        component: (
          <CampaignPrizeComponent
            items={list?.promotion_app_products_gifts ?? []}
          />
        ),
        key: "info4",
        bg: true,
      });
    }

    setListAcc([...arrAcc]);
  };

  useEffect(() => {
    const customerId = query.get("customerId");
    getItem(customerId);
  }, []);

  return (
    <Page className="page " style={{ paddingTop: "60px" }} hideScrollbar={true}>
      <HeaderComponent title="Chi tiết khuyến mãi" />

      <CampaignBannerComponent src={item?.banner_images} />

      <CampaignConditionsComponent item={item} />

      <AccordionComponent list={listAcc} />

      <CampaignInfoComponent images={item?.desc_images} note={item?.note} />
    </Page>
  );
};

export default CampaignPromotionDetailPage;
