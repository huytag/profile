import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import { Box, Text } from "zmp-ui";
import { showNavigationState } from "../../store/navigation";
import { IconFilter } from "../icon";
import IconFunnel from "../icon/funnel";
import SheetFilterCampaignComponent from "../sheet/filter/filterCampaign";
import LabelFilterComponent from "./labelFilter";

const CampaignFilterComponent = ({
  action,
  isWheel = false,
  hiddenFilterDay = false,
  filter,
  closeFilter,
}) => {
  const [showFilter, setShowFilter] = useState(false);
  const setShowBottom = useSetRecoilState(showNavigationState);
  const allTypeFilter = [
    {
      type: "date",
      key: "start_date",
      label: "Bắt đầu",
    },
    {
      type: "date",
      key: "end_date",
      label: "Kết thúc",
    },
    {
      type: "text",
      key: "keyword",
      label: "Từ khoá",
    },
  ];

  const sheetAction = (type, value) => {
    setShowFilter(false);
    setShowBottom(true);
    if (type === "cancel") {
      action(type);
      return;
    }

    action(type, value);
  };

  return (
    <Box>
      <Box className="flex align-items-center justify-start">
        <Box>
          <Text.Title
            onClick={() => {
              setShowFilter(!showFilter);
              setShowBottom(false);
            }}
          >
            Bộ lọc
            <IconFilter className="w-6 inline-block ml-1" />
          </Text.Title>

          <SheetFilterCampaignComponent
            hiddenFilterDay={hiddenFilterDay}
            isVisible={showFilter}
            filter={filter}
            action={sheetAction}
          />
        </Box>
      </Box>

      {Object.values(filter).some((x) => x !== null && x !== "") && (
        <LabelFilterComponent
          filter={filter}
          allTypeFilter={allTypeFilter}
          action={closeFilter}
        />
      )}
    </Box>
  );
};

export default CampaignFilterComponent;
