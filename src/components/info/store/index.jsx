import React from "react";
import { Text } from "zmp-ui";
import TextMapComponent from "../../text/map";

const InfoStoreComponent = ({
  item,
  sizeTitle = "small",
  classNameTitle = "",
}) => {
  return (
    <>
      <Text.Title size={sizeTitle} className={classNameTitle}>
        Thông tin cửa hàng
      </Text.Title>
      <Text size="xSmall" className="ml-3 text-gray-500">
        {item?.name} <br />
        {item?.phone} <br />
        <TextMapComponent
          text={item?.address}
          lat={item?.address_lat}
          lng={item?.address_lng}
        />
      </Text>
    </>
  );
};

export default InfoStoreComponent;
