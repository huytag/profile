import React from "react";
import { Icon, Text } from "zmp-ui";
import noImage from "../../../static/no-image.png";
import { Link } from "react-router-dom";
import TextBaseLineComponent from "../../textBaseLine";
import { parseUtcToLocal } from "../../../utils";
import { canViewReport } from "../../../services/hasPermission";

const CampaignPromotionItemComponent = ({ item }) => {
  return (
    <>
      <Link to={`${item?.id}/${canViewReport() ? "saleman" : ""}`}>
        <div className="p-3 text-4xl mt-3 flex duration-500 bg-white rounded-xl shadow-lg shadow-black-500/50">
          <img
            src={item?.avatar_images ? item?.avatar_images[0] : noImage}
            alt="alt source"
            className="w-full max-w-[25vw] h-[25vw] aspect-square object-cover"
          />
          <div style={{ width: `calc(100% - 29vw)` }} className="ml-auto">
            <Text.Title size="normal">{item?.name ?? "-"}</Text.Title>
            <TextBaseLineComponent
              title={<Icon icon="zi-calendar" size={20} />}
              value={`${parseUtcToLocal(item?.start_date, "DD/MM/YYYY")} 
                - ${parseUtcToLocal(
                  item?.expiry_date ?? item?.end_date,
                  "DD/MM/YYYY"
                )}`}
              isBetween={false}
            />
            <TextBaseLineComponent
              title="Mã chương trình"
              value={item?.code}
              mt={1}
              isBetween={false}
            />
          </div>
        </div>
      </Link>
    </>
  );
};

export default CampaignPromotionItemComponent;
