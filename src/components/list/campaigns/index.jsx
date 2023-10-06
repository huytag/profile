import React from "react";
import { Text } from "zmp-ui";
import CampaignComponent from "../../campaign";

const ListCampaignsComponent = ({ items = [] }) => {
  return (
    <>
      {items.map((item, index) => (
        <CampaignComponent item={item} key={index} />
      ))}

      <div
        className={`p-3 text-4xl mt-3 flex group duration-500 bg-white rounded-xl shadow-lg shadow-black-500/50 hover:shadow-blue-500/50 ${
          items.length > 0 ? "hidden" : ""
        }`}
      >
        <Text size="large">Không có dữ liệu</Text>
      </div>
    </>
  );
};

export default ListCampaignsComponent;
