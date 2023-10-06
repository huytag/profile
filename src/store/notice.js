import { atom, selector } from "recoil";

export const noticeState = atom({
  key: "noticeState",
  default: {
    visible: false,
    type: "error",
    text: "Network error",
  },
});

export const noticeSuccessState = selector({
  key: "noticeSuccessState",
  get: () => {},
  set: ({ set }, newValue) => {
    set(noticeState, {
      visible: true,
      type: "success",
      text: newValue ?? "Thành công.",
    });
  },
});

export const noticeErrorState = selector({
  key: "noticeErrorState",
  get: () => {},
  set: ({ set }, newValue) => {
    set(noticeState, {
      visible: true,
      type: "error",
      text: newValue ?? "Thất bại.",
    });
  },
});

export const noticeInfoState = selector({
  key: "noticeInfoState",
  get: () => {},
  set: ({ set }, newValue) => {
    set(noticeState, {
      visible: true,
      type: "info",
      text: newValue,
    });
  },
});

export const noticeLoadingState = selector({
  key: "noticeLoadingState",
  get: () => {},
  set: ({ set }, newValue) => {
    set(noticeState, {
      visible: true,
      type: "loading",
      text: newValue ?? "Đang tải dữ liệu...",
      duration: 60000,
    });
  },
});
