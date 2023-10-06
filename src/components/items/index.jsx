import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Text, Icon, ImageViewer, useNavigate } from "zmp-ui";
import noImage from "../../static/no-image.png";
import { parseUtcToLocal } from "../../utils";

const ItemComponent = ({ item, isShowIcon = true, isRedirect = true }) => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const handleRedirect = () => {
    if (!isRedirect) return;

    navigate(`${item?.id}`);
  };

  return (
    <>
      <div onClick={handleRedirect}>
        <div className="p-3 text-4xl mt-3 flex group duration-500 bg-white rounded-xl shadow-lg shadow-black-500/50 ">
          <img
            src={item?.image_url ?? noImage}
            alt="alt source"
            className="w-full max-w-[25vw] h-[25vw] aspect-square object-cover"
            onClick={() => {
              if (isRedirect) return;

              setVisible(true);
            }}
          />
          <div
            style={{ width: `calc(100% - 28vw)` }}
            className="ml-auto flex flex-col justify-between"
          >
            <Text.Title size="normal">{item?.name ?? ""}</Text.Title>
            <div className="mt-3">
              <div className="flex items-center justify-between">
                <Text size="xSmall" className="text-gray-500">
                  <Icon icon="zi-info-circle-solid" size={16} /> SKU
                </Text>
                <Text size="xSmall" className="font-semibold ml-2">
                  {item?.sku ?? "-"}
                </Text>
              </div>

              <div className="flex items-center justify-between mt-1">
                <Text size="xSmall" className="text-gray-500 flex items-center">
                  <Icon icon="zi-calendar" size={16} className="mr-1" /> Lắp đặt
                </Text>
                <Text size="xSmall" className="font-semibold ml-2">
                  {parseUtcToLocal(item?.installation_at, "DD/MM/YYYY")}
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ImageViewer
        onClose={() => setVisible(false)}
        activeIndex={0}
        images={[
          {
            src: item?.image_url,
            alt: item?.name,
            key: "1",
          },
        ]}
        visible={visible}
      />
    </>
  );
};

export default ItemComponent;
