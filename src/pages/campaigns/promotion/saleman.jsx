import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useSetRecoilState } from "recoil";
import { Box, Page, Text } from "zmp-ui";
import HeaderComponent from "../../../components/header";
import { apiClient } from "../../../services/api";
import { loadingState } from "../../../store/loading";
import { noticeErrorState } from "../../../store/notice";
import { PROMOTION_DETAIL } from "../../../utils/constApiRoute";
import CampaignFilterComponent from "../../../components/filter/campaignFilter";
import CampaignOutletComponent from "../../../components/campaign/saleman/outlet";

const CampaignPromotionSaleman = () => {
  const { id } = useParams();
  const setLoading = useSetRecoilState(loadingState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({
    keyword: null,
  });

  const fetchOutlets = async () => {
    setLoading(true);
    await apiClient
      .get(`${PROMOTION_DETAIL}/${id}/outlets`, { params: { ...filter } })
      .then((response) => {
        setData(response?.data?.promotions_outlets);
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  const onActionFilter = (type, value) => {
    if (type === "cancel") return;

    setFilter({
      ...filter,
      keyword: value?.keyword,
    });
  };

  const closeFilter = useCallback((value) => {
    setFilter({
      ...filter,
      ...value,
    });
  });

  useEffect(() => {
    fetchOutlets();
  }, [filter]);

  return (
    <Page className="page " style={{ paddingTop: "60px" }} hideScrollbar={true}>
      <HeaderComponent title="Danh sách Outlet" />

      <Box className="px-5 py-3 text-4xl items-center mt-4 bg-white rounded-xl shadow-lg shadow-black-500/50">
        <Box className="flex justify-between mb-3">
          <Text.Title size="large" className="font-semibold">
            Danh sách outlet
          </Text.Title>
        </Box>

        <CampaignFilterComponent
          hiddenFilterDay
          filter={filter}
          action={onActionFilter}
          closeFilter={closeFilter}
        />

        <CampaignOutletComponent list={data} appName="promotion" />
      </Box>
    </Page>
  );
};

export default CampaignPromotionSaleman;
