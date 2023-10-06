import React from "react";
import { Text } from "zmp-ui";
import TextBaseLineComponent from "../../textBaseLine";
import noImage from "./../../../static/no-image.png";

const CampaignItemsSetupComponent = ({ item }) => {
  return (
    <>
      <div className="text-4xl flex mt-3 border-b-2 border-dashed border-[#dddddd] pb-3 last:border-b-0">
        <img
          src={item?.item_images ?? noImage}
          alt="alt source"
          className="w-full max-w-[25vw] h-[25vw] aspect-square object-cover"
        />
        <div style={{ width: `calc(100% - 28vw)` }} className="ml-auto">
          <div>
            <Text.Title size="large">{item?.item_name}</Text.Title>
            <TextBaseLineComponent
              title="Loại thiết bị:"
              value={item?.item_inventory_cd}
              isBetween={false}
            />
            <TextBaseLineComponent
              title="Mã code thiết bị:"
              value={"Tủ mát 1 cách"}
              mt={1}
              isBetween={false}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CampaignItemsSetupComponent;
