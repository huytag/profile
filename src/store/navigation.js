import { atom } from "recoil";

export const showNavigationState = atom({
  key: "showNavigationState",
  default: true,
});

export const isActiveNavigationState = atom({
  key: "isActiveNavigationState",
  default: "home",
});

export const hiddenBottomSheetState = atom({
  key: "hiddenBottomSheetState",
  default: false,
});
