import { atom, selector } from "recoil";
import { empty } from "../utils";

export const storeAppState = atom({
  key: "storeAppState",
  default: {},
});

export const storeDropdownProductSells = selector({
  key: "storeDropdownProductSellsState",
  get: ({ get }) => {
    const list = get(storeAppState);

    if (empty(list)) return [];

    if (!list?.sampling_product_sells.length) {
      return [];
    }

    return list?.sampling_product_sells.map((i) => {
      return {
        value: i?.product_name,
        label: i?.product_name,
        id: i?.id,
      };
    });
  },
});

export const storeDropdownProductGifts = selector({
  key: "storeDropdownProductGiftsState",
  get: ({ get }) => {
    const list = get(storeAppState);

    if (empty(list)) return [];

    if (!list?.sampling_product_gifts.length) {
      return [];
    }

    return list?.sampling_product_gifts.map((i) => {
      return {
        value: i?.product_name,
        label: i?.product_name,
        id: i?.id,
      };
    });
  },
});
