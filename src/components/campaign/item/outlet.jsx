import React from "react";
import { Text } from "zmp-ui";
import noImage from "../../../static/no-image.png";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarPlus,
  faCalendarWeek,
} from "@fortawesome/free-solid-svg-icons";
import TextBaseLineComponent from "../../../components/textBaseLine";
import { parseUtcToLocal } from "../../../utils";
import { canViewReport } from "../../../services/hasPermission";
import { PER_TRADE_DISPLAY_REPORT_VIEW } from "../../../utils/enumPermission";

const CampaignDisplayOutlet = ({ item }) => {
  return (
    <>
      <Link
        to={`${item?.id}/${
          canViewReport(PER_TRADE_DISPLAY_REPORT_VIEW) ? "saleman" : ""
        }`}
      >
        <div className="p-3 text-4xl mt-3  duration-500 bg-white rounded-xl shadow-lg shadow-black-500/50">
          <Text.Title size="normal" className="mt-3">
            {item?.name ?? "-"}
          </Text.Title>
          <div className="flex mt-3">
            <img
              src={item?.avatar_images ?? noImage}
              alt="alt source"
              className="w-full max-w-[25vw] h-[25vw] aspect-square object-cover"
            />
            <div style={{ width: `calc(100% - 29vw)` }} className="ml-auto">
              <TextBaseLineComponent
                title="Trạng thái:"
                value={item?.status_text ?? "-"}
              />
              <TextBaseLineComponent
                title={<FontAwesomeIcon icon={faCalendarWeek} />}
                value={`${parseUtcToLocal(item?.start_date, "DD/MM/YYYY")} 
                - ${parseUtcToLocal(item?.end_date, "DD/MM/YYYY")}`}
                mt={1}
              />
              <TextBaseLineComponent
                title={<FontAwesomeIcon icon={faCalendarPlus} />}
                value={`${parseUtcToLocal(
                  item?.created_from_date,
                  "DD/MM/YYYY"
                )} 
                - ${parseUtcToLocal(item?.created_to_date, "DD/MM/YYYY")}`}
                mt={1}
              />
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default CampaignDisplayOutlet;
