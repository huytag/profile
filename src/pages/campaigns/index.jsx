import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { Box, Page, Text } from "zmp-ui";
import HeaderComponent from "../../components/header";
import { list } from "../../services/api";
import { loadingState } from "../../store/loading";
import { noticeErrorState } from "../../store/notice";
import { DROPDOWN_TRADE } from "../../utils/constApiRoute";
import * as AppType from "../../utils/enumAppType";
import { APP_TYPES } from "../../utils/enumDropdown";

const CampaignsPage = () => {
  const noticeError = useSetRecoilState(noticeErrorState);
  const setLoading = useSetRecoilState(loadingState);
  const [campaigns, setCampaigns] = useState([]);

  const getList = async () => {
    setLoading(true);

    await list(DROPDOWN_TRADE, {
      objects: [APP_TYPES],
    })
      .then((response) => {
        setCampaigns(
          response?.data?.options.app_types.filter(
            (i) => i.value !== AppType.SAMPLING
          )
        );
      })
      .catch((error) => noticeError(error?.message))
      .finally(() => setLoading(false));
  };

  const parseUrl = (type) => {
    switch (type) {
      // case AppType.SAMPLING:
      //   return "sampling";

      case AppType.ACCUMULATE:
        return "accumulation";

      case AppType.DISPLAY:
        return "display";

      case AppType.PROMOTION:
        return "promotion";

      case AppType.SETUP:
        return "setup";

      case AppType.GIFT:
        return "gift";

      default:
        return "wheel";
    }
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <Page className="page " style={{ paddingTop: "60px" }} hideScrollbar={true}>
      <HeaderComponent title="Danh sách chương trình" />

      {campaigns.map((item, index) => (
        <div
          className="bg-white rounded-lg shadow-sm mt-3 first:mt-0"
          key={index}
        >
          <Link
            to={parseUrl(item?.value)}
            className="flex items-center p-4 py-6"
          >
            <Box className="bg-[#e9e9e9] p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#1565bd"
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  fill="none"
                  strokeLinejoin="round"
                  d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                />
              </svg>
            </Box>

            <Text className="text-lg ml-3">{item?.label}</Text>
            <FontAwesomeIcon
              icon={faArrowRight}
              size="lg"
              className="ml-auto text-[#1565bd]"
            />
          </Link>
        </div>
      ))}
    </Page>
  );
};

export default CampaignsPage;
