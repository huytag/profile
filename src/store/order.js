import { atom, selector } from "recoil";

export const orderDefaultState = atom({
  key: "orderDefaultState",
  default: {
    id: null,
    note: null,
    is_edit: false,
    orders: [],
  },
});

export const setOrderDefaultState = selector({
  key: "setOrderDefaultState",
  get: () => {},
  set: ({ set }) => {
    set(orderDefaultState, {
      id: null,
      note: null,
      is_edit: false,
      orders: [],
    });
  },
});

export const setOrderEditState = selector({
  key: "setOrderEditState",
  get: ({ get }) => {
    return get(orderDefaultState).is_edit;
  },
  set: ({ get, set }, newValue) => {
    set(orderDefaultState, () => ({
      is_edit: true,
      ...newValue,
    }));
  },
});
