import { atom } from "recoil";

export const countUnreadNotificationState = atom({
  key: "countUnreadNotificationState",
  default: 0,
});
