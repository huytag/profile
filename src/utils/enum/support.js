export const STATUS_SUPPORT = {
  WAITING: 1,
  IN_PROGRESS: 2,
  CLOSED: 3,
};

export const TAB_ITEMS_SUPPORT = [
  {
    value: STATUS_SUPPORT.WAITING,
    text: "Chờ phản hồi",
  },
  {
    value: STATUS_SUPPORT.IN_PROGRESS,
    text: "Đã phản hồi",
  },
  {
    value: STATUS_SUPPORT.CLOSED,
    text: "Đã hoàn thành",
  },
];
