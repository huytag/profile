import React from "react";
import { Icon, Text } from "zmp-ui";
import noImage from "../../../static/no-image.png";
import { format_currency } from "../../../utils";
import TextBaseLineComponent from "../../textBaseLine";

const OrderItemComponent = ({ cart = {}, item, action = () => {} }) => {
  return (
    <div className="flex items-center py-4 border-b-2 last:border-none">
      <img
        src={item?.images ?? noImage}
        className="w-full max-w-[25vw] h-[25vw] aspect-square object-cover"
      />
      <div className="mx-auto" style={{ width: `calc(100% - 39vw)` }}>
        <Text.Title size="small">{item?.name}</Text.Title>
        <TextBaseLineComponent
          isBetween={false}
          title="Mã sản phẩm:"
          value={item?.code}
        />
        <TextBaseLineComponent
          isBetween={false}
          title="Đơn giá:"
          value={format_currency(item?.price)}
          mt={1}
        />
        <TextBaseLineComponent
          isBetween={false}
          title="Thùng đã đặt:"
          value={cart?.quantity_boxes ?? 0}
          mt={1}
        />
        <TextBaseLineComponent
          isBetween={false}
          title="Hộp đã đặt:"
          value={cart?.quantity_bins ?? 0}
          mt={1}
        />
      </div>
      <div>
        <Icon
          icon="zi-plus-circle"
          size={40}
          className="text-green-500"
          onClick={() => action(item)}
        />
      </div>
    </div>
  );
};

export default OrderItemComponent;
