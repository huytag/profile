import {
  STATUS_DONE,
  STATUS_REPAIR,
  STATUS_WAITING_CONFIRM,
} from "../enumTicket";

export const TAB_ITEMS_TICKET = [
  {
    value: STATUS_WAITING_CONFIRM,
    text: "Chờ xác nhận",
  },
  {
    value: STATUS_REPAIR,
    text: "Đang xử lý",
  },
  {
    value: STATUS_DONE,
    text: "Đã hoàn thành",
  },
];
