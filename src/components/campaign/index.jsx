import React from "react";
import { Text } from "zmp-ui";
import noImage from "../../static/no-image.png";
import { Link } from "react-router-dom";

const CampaignComponent = ({ item }) => {
  return (
    <>
      <Link to="/campaign/1">
        <div className="p-3 text-4xl mt-3 flex duration-500 bg-white rounded-xl shadow-lg shadow-black-500/50 hover:shadow-blue-500/50">
          <img
            src={item?.image_url ?? noImage}
            alt="alt source"
            className="max-w-[25vw] w-full"
          />
          <div
            style={{ width: `calc(100% - 33vw)` }}
            className="mx-auto flex flex-col justify-between"
          >
            <Text.Title size="normal" className="mt-3">
              {item?.name ?? "-"}
            </Text.Title>
            <div>
              <Text size={16} className="mt-2">
                Số lượng: {item?.total ?? 0}
              </Text>
              <Text size={16}>
                Thời gian: {item?.start_at ?? "00/00/0000"} -{" "}
                {item?.end_at ?? "00/00/0000"}
              </Text>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default CampaignComponent;
