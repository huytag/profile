import { atom, selector } from "recoil";

export const defaultMediaState = atom({
  key: "defaultMediaState",
  default: {
    images: [],
    videos: [],
  },
});

export const setMediaDefaultState = selector({
  key: "setMediaDefaultState",
  get: () => {},
  set: ({ set }) => {
    set(defaultMediaState, {
      images: [],
      videos: [],
    });
  },
});

export const getMediaState = selector({
  key: "getMediaState",
  get: ({ get }) => {
    return get(defaultMediaState);
  },
});

export const mediaImagesState = selector({
  key: "mediaImagesState",
  get: ({ get }) => {
    return get(defaultMediaState).images;
  },
  set: ({ get, set }, newValue) => {
    set(defaultMediaState, (prevState) => ({
      ...prevState,
      images: [...get(mediaImagesState), newValue],
    }));
  },
});

export const mediaVideosState = selector({
  key: "mediaVideosState",
  get: ({ get }) => {
    return get(defaultMediaState).videos;
  },
  set: ({ get, set }, newValue) => {
    set(defaultMediaState, (prevState) => ({
      ...prevState,
      videos: newValue ? [newValue] : [],
    }));
  },
});
