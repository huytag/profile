import React from "react";
import { Text } from "zmp-ui";
import { Link } from "react-router-dom";
import TextBaseLineComponent from "../../textBaseLine";

const CampaignSamplingStoreItemComponent = ({ item }) => {
  return (
    <>
      <Link to={`${item?.code}`}>
        <div className="p-4 text-4xl mt-3 duration-500 bg-white rounded-xl shadow-lg shadow-black-500/50">
          <Text.Title size="normal">{item?.name ?? "-"}</Text.Title>
          <TextBaseLineComponent title="Mã" value={item?.code} />
          <TextBaseLineComponent title="Tên" value={item?.name} mt={1} />
          <TextBaseLineComponent
            title="Địa chỉ"
            value={item?.address}
            mt={1}
            className="min-w-[50px]"
          />
          <TextBaseLineComponent
            title="Mã nhà phân phối"
            value={item?.distributor_code}
          />
          <TextBaseLineComponent
            title="Tên nhà phân phối"
            value={item?.distributor_name}
            mt={1}
          />
        </div>
      </Link>
    </>
  );
};

export default CampaignSamplingStoreItemComponent;
