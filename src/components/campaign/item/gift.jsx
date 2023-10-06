import React from "react";
import { Box, Icon, Text } from "zmp-ui";
import noImage from "../../../static/no-image.png";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarWeek } from "@fortawesome/free-solid-svg-icons";
import TextBaseLineComponent from "../../textBaseLine";
import { parseUtcToLocal } from "../../../utils";

const CampaignGiftItemComponent = ({ item }) => {
  return (
    <>
      <Link to={`${item?.id}`}>
        <Box className="p-3 text-4xl mt-3 flex justify-between items-center duration-500 bg-white rounded-xl shadow-lg shadow-black-500/50">
          <Box>
            <Text.Title size="normal">{item?.name ?? "-"}</Text.Title>
            <TextBaseLineComponent
              title="Mã chương trình:"
              value={item?.code}
              mt={1}
              isBetween={false}
            />
            <TextBaseLineComponent
              title={<FontAwesomeIcon icon={faCalendarWeek} />}
              value={`${parseUtcToLocal(item?.start_date, "DD/MM/YYYY")} 
                - ${parseUtcToLocal(item?.end_date, "DD/MM/YYYY")}`}
              isBetween={false}
            />
          </Box>
          <Box>
            <Icon size="30" icon="zi-chevron-right"></Icon>
          </Box>
        </Box>
      </Link>
    </>
  );
};

export default CampaignGiftItemComponent;
