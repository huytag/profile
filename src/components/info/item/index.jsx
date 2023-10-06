import React from "react";
import { Text } from "zmp-ui";
import ItemComponent from "../../items";

const InfoItemComponent = ({ item, title = "Thiết bị đã chọn" }) => {
  return (
    <>
      <Text.Title size="small" className="mt-4">
        {title}
      </Text.Title>
      <ItemComponent item={item} isShowIcon={false} isRedirect={false} />
    </>
  );
};

export default InfoItemComponent;
