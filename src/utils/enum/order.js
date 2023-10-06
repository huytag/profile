import * as StatusOrder from "../enumOrder";

export const TAB_ITEMS_ORDER = [
  {
    value: StatusOrder.ALL,
    text: "Tất cả",
  },
  {
    value: StatusOrder.OPEN,
    text: "Đang xử lý",
  },
  {
    value: StatusOrder.SHIPPING,
    text: "Đang giao",
  },
  {
    value: StatusOrder.RELEASE,
    text: "Hoàn tất",
  },
  {
    value: StatusOrder.CANCEL,
    text: "Đã huỷ",
  },
];
