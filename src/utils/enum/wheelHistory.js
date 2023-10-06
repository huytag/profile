export const STATUS_WHEEL_HISTORY = {
  ALL: 0,
  WAITING_RECEIVED: 1,
  RECEIVED: 2,
};

export const TAB_ITEMS_WHEEL_HISTORY = [
  {
    value: STATUS_WHEEL_HISTORY.ALL,
    text: "Tất cả",
  },
  {
    value: STATUS_WHEEL_HISTORY.WAITING_RECEIVED,
    text: "Chờ trao thưởng",
  },
  {
    value: STATUS_WHEEL_HISTORY.RECEIVED,
    text: "Đã nhận thưởng",
  },
];
