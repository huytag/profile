import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useSetRecoilState } from "recoil";
import { Box, Page, Text } from "zmp-ui";
import HeaderComponent from "../../../components/header";
import { apiClient } from "../../../services/api";
import { loadingState } from "../../../store/loading";
import { noticeErrorState } from "../../../store/notice";
import { LUCKY_APP } from "../../../utils/constApiRoute";
import CampaignFilterComponent from "../../../components/filter/campaignFilter";
import ReportStatisticComponent from "../../../components/campaign/saleman/statistic";
import CampaignOutletComponent from "../../../components/campaign/saleman/outlet";

// TODO history and detail saleman
const CampaignLuckySaleman = () => {
  const { id } = useParams();
  const setLoading = useSetRecoilState(loadingState);
  const noticeError = useSetRecoilState(noticeErrorState);
  const [statistic, setStatistic] = useState([]);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({
    keyword: null,
  });

  const fetchStatictis = async () => {
    setLoading(true);
    await apiClient
      .get(`${LUCKY_APP}/${id}/statistic`)
      .then((response) => {
        setStatistic(response?.data?.statistics);
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  const fetchOutlets = async () => {
    setLoading(true);
    await apiClient
      .get(`${LUCKY_APP}/${id}/outlets`, { params: { ...filter } })
      .then((response) => {
        setData(response?.data?.lucky_app_outlets);
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
    fetchStatictis();
  }, []);

  useEffect(() => {
    fetchOutlets();
  }, [filter]);

  return (
    <Page className="page " style={{ paddingTop: "60px" }} hideScrollbar={true}>
      <HeaderComponent title="Báo cáo thống kê" />

      <ReportStatisticComponent item={statistic} />

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

        <CampaignOutletComponent list={data} appName="wheel" />
      </Box>
    </Page>
  );
};

export default CampaignLuckySaleman;
