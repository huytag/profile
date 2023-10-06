import * as AppStatus from "../../utils/enumSetupAppResult";

export const TAB_ITEMS_SET_UP = [
  {
    value: AppStatus.WAITING_FOR_REVIEW,
    text: "Chờ xét duyệt",
  },
  {
    value: AppStatus.WAIT_FOR_INSTALLATION,
    text: "Chờ lắp đặt",
  },
  {
    value: AppStatus.DONE,
    text: "Đã bàn giao",
  },
  {
    value: AppStatus.REJECT,
    text: "Bị từ chối",
  },
];
