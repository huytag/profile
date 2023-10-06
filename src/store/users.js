import { atom, selector } from "recoil";

export const defaultUserState = atom({
  key: "defaultUserState",
  default: {
    id: null,
    first_name: null,
    last_name: null,
    full_name: null,
    phone: null,
    email: null,
    code: null,
    is_outlet: false,
    is_super_admin: false,
    avatar: null,
    full_address: null,
    business_type: null,
    tax: null,
    working_position: null,
    permissions: [],
  },
});

export const setUserState = selector({
  key: "setUserState",
  get: () => {},
  set: ({ set }, newValue) => {
    set(defaultUserState, newValue);
  },
});

export const getUserState = selector({
  key: "getUserState",
  get: ({ get }) => {
    return get(defaultUserState);
  },
});

export const getIsOutletState = selector({
  key: "getIsOutletState",
  get: ({ get }) => {
    return get(defaultUserState.is_outlet);
  },
});

export const getPermissionsState = selector({
  key: "getPermissionsState",
  get: ({ get }) => {
    return get(defaultUserState.permissions);
  },
});
