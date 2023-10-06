import React, { useState } from "react";
import { Box, Page } from "zmp-ui";
import CampaignSetupPage from ".";
import HeaderComponent from "../../../components/header";
import Select2Component from "../../../components/select2";
import { isSaleman, isSupervisor } from "../../../services/hasPermission";
import CampaignSetupResultsPage from "./results";

const CampaignSetupMainPage = () => {
  const [dataOptionSetup, setDataOptionSetup] = useState(1);
  const optionsSetup = [
    {
      value: 1,
      label: "Danh sách chương trình lắp đặt",
    },
    {
      value: 2,
      label: "Danh sách yêu cầu lắp đặt",
    },
  ];

  return (
    <Page className="page " style={{ paddingTop: "60px" }} hideScrollbar={true}>
      <HeaderComponent
        title={
          dataOptionSetup === 1
            ? "Chương trình lắp đặt"
            : "Danh sách yêu cầu lắp đặt"
        }
      />

      {!isSaleman() && !isSupervisor() && (
        <Box className="bg-white rounded-md p-2">
          <Select2Component
            isSearchable={false}
            options={optionsSetup}
            placeholder="Chọn loại danh sách"
            defaultValue={optionsSetup.filter(
              (item) => item.value == dataOptionSetup
            )}
            index="value"
            onSelect={(value) => setDataOptionSetup(value)}
            isClearable={false}
            className="border-0"
          />
        </Box>
      )}
      {dataOptionSetup === 1 ? (
        <CampaignSetupPage />
      ) : (
        <CampaignSetupResultsPage />
      )}
    </Page>
  );
};

export default CampaignSetupMainPage;
